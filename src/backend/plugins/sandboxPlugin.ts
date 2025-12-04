import { Buffer } from 'node:buffer';
import { spawn } from 'node:child_process';
import { mkdir, rm, readdir, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import process from 'node:process';
import type { Writable } from 'node:stream';
import archiver from 'archiver';
import { Elysia, t } from 'elysia';

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * BYTES_PER_KB;
const MS_PER_MINUTE = 60000;
const MAX_AGE_MINUTES = 30;
const CLEANUP_INTERVAL_MINUTES = 5;
const MAX_AGE_MS = MAX_AGE_MINUTES * MS_PER_MINUTE;
const CLEANUP_INTERVAL_MS = CLEANUP_INTERVAL_MINUTES * MS_PER_MINUTE;
const PROMPT_DELAY_MS = 500;
const STDIN_CLOSE_DELAY_MS = 3000;
const OUTPUT_PREVIEW_LENGTH = 500;
const ZIP_COMPRESSION_LEVEL = 9;
const MB_DECIMAL_PLACES = 2;

export interface PlaygroundConfig {
	projectName: string;
	configurationType: 'default' | 'custom';
	frontends: string[];
	databaseEngine: 'none' | 'postgresql' | 'sqlite' | 'mysql' | 'mariadb' | 'gel' | 'mongodb' | 'singlestore' | 'cockroachdb' | 'mssql';
	databaseHost?: 'none' | 'neon' | 'planetscale' | 'turso';
	orm?: 'drizzle' | 'prisma';
	authProvider: 'none' | 'absoluteAuth';
	codeQualityTool: 'eslint+prettier' | 'biome';
	useTailwind: boolean;
	useHtmlScripts: boolean;
	selectedPlugins: ('@elysiajs/cors' | '@elysiajs/swagger' | 'elysia-rate-limit')[];
	gitInit: boolean;
	installDeps: boolean;
}

export interface GeneratedFile {
	path: string;
	content: string;
}

export interface GenerateSuccess {
	success: true;
	cliCommand: string;
	cliOutput: string;
	files: GeneratedFile[];
	message: string;
}

export interface GenerateFailure {
	success: false;
	errorType: 'Internal Server Error';
	errorMessage: string;
}

export type GenerateResult = GenerateSuccess | GenerateFailure;

interface ProjectCache {
	dir: string;
	timestamp: number;
}

interface ProcessResult {
	exitCode: number;
	output: string;
	success: boolean;
}

const generatedProjects = new Map<string, ProjectCache>();

const ignoreError = () => {
	// Silently ignore cleanup errors
};

const cleanupExpiredProject = (name: string, data: ProjectCache, now: number) => {
	if (now - data.timestamp <= MAX_AGE_MS) return;
	
	rm(data.dir, { force: true, recursive: true }).catch(ignoreError);
	generatedProjects.delete(name);
};

setInterval(() => {
	const now = Date.now();
	for (const [name, data] of generatedProjects.entries()) {
		cleanupExpiredProject(name, data, now);
	}
}, CLEANUP_INTERVAL_MS);

const buildCliArgs = (config: PlaygroundConfig) => {
	const args = ['create', 'absolutejs', config.projectName, '--skip'];

	args.push(config.codeQualityTool === 'biome' ? '--biome' : '--eslint+prettier');

	for (const frontend of config.frontends) {
		args.push(`--${frontend}`);
	}

	if (config.useTailwind) args.push('--tailwind');
	if (config.useHtmlScripts) args.push('--html-scripts');

	const hasDatabase = config.databaseEngine !== 'none';

	if (hasDatabase) args.push('--db', config.databaseEngine);
	if (hasDatabase && config.databaseHost && config.databaseHost !== 'none') {
		args.push('--db-host', config.databaseHost);
	}
	if (hasDatabase && config.orm) args.push('--orm', config.orm);

	args.push('--directory', config.configurationType);

	if (config.authProvider !== 'none') {
		args.push('--auth', config.authProvider);
	}

	for (const plugin of config.selectedPlugins) {
		args.push('--plugin', plugin);
	}

	args.push('--install');

	return args;
};

const writeAnswerIfOpen = (stdin: Writable, answer: string) => {
	if (stdin.destroyed) return;
	stdin.write(answer);
};

const closeStdinIfOpen = (stdin: Writable) => {
	if (stdin.destroyed) return;
	stdin.end();
};

const runCreateAbsoluteJS = (config: PlaygroundConfig, workDir: string) =>
	// eslint-disable-next-line promise/avoid-new
	new Promise<ProcessResult>((resolve) => {
		let stdout = '';
		let stderr = '';
		const args = buildCliArgs(config);

		console.warn(`Running: bun ${args.join(' ')} in ${workDir}`);

		const proc = spawn('bun', args, {
			cwd: workDir,
			env: { ...process.env, CI: 'true', TERM: 'dumb' },
			stdio: ['pipe', 'pipe', 'pipe']
		});

		const answers = ['n\n', 'n\n', 'y\n', 'n\n', 'y\n'];
		answers.forEach((ans, idx) => {
			setTimeout(() => writeAnswerIfOpen(proc.stdin, ans), PROMPT_DELAY_MS * (idx + 1));
		});
		setTimeout(() => closeStdinIfOpen(proc.stdin), STDIN_CLOSE_DELAY_MS);

		proc.stdout.on('data', (data: Buffer) => { stdout += data.toString(); });
		proc.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

		proc.on('close', (code) => {
			const output = stderr ? `${stdout}\nstderr\n${stderr}` : stdout;
			resolve({ exitCode: code || 0, output, success: code === 0 });
		});

		proc.on('error', (err) => {
			resolve({ exitCode: 1, output: `Failed to start: ${err.message}`, success: false });
		});
	});

const readFileContent = async (fullPath: string, relativePath: string, fileSize: number) => {
	if (fileSize > BYTES_PER_MB) {
		const sizeMB = (fileSize / BYTES_PER_MB).toFixed(MB_DECIMAL_PLACES);

		return { content: `File too large: ${sizeMB} MB`, path: relativePath };
	}

	const content = await readFile(fullPath, 'utf-8').catch(() => null);

	return { content: content ?? 'unable to read', path: relativePath };
};

interface FileEntry {
	path: string;
	content: string;
}

type FileEntryList = FileEntry[];
type FileEntryPromise = Promise<FileEntryList>;

const processFileEntry: (entryName: string, isDirectory: boolean, dir: string, baseDir: string) => FileEntryPromise = async (
	entryName,
	isDirectory,
	dir,
	baseDir
) => {
	if (entryName === 'node_modules' || entryName === '.git') return [];

	const fullPath = join(dir, entryName);
	const relativePath = relative(baseDir, fullPath);

	if (isDirectory) {
		return readAllFiles(fullPath, baseDir);
	}

	const stats = await stat(fullPath).catch(() => null);
	if (!stats) {
		return [{ content: 'Binary file or unable to read', path: relativePath }];
	}

	const fileResult = await readFileContent(fullPath, relativePath, stats.size);

	return [fileResult];
};

const readAllFiles: (dir: string, baseDir: string) => FileEntryPromise = async (dir, baseDir) => {
	const entries = await readdir(dir, { withFileTypes: true });
	const filePromises: FileEntryPromise[] = entries.map((entry) => 
		processFileEntry(entry.name, entry.isDirectory(), dir, baseDir)
	);
	const results: FileEntryList[] = await Promise.all(filePromises);

	return results.flat();
};

const createZipArchive = (projectDir: string) =>
	// eslint-disable-next-line promise/avoid-new
	new Promise<Buffer>((resolve, reject) => {
		const chunks: Buffer[] = [];
		const archive = archiver('zip', { zlib: { level: ZIP_COMPRESSION_LEVEL } });

		archive.on('data', (chunk: Buffer) => chunks.push(chunk));
		archive.on('end', () => resolve(Buffer.concat(chunks)));
		archive.on('error', reject);
		archive.directory(projectDir, false);
		archive.finalize();
	});

const validateConfig = (config: PlaygroundConfig) => {
	if (!config.projectName?.trim()) {
		return { message: 'Project name is required', valid: false };
	}
	if (!/^[a-zA-Z0-9_-]+$/.test(config.projectName)) {
		return { message: 'Project name can only contain letters, numbers, dashes, and underscores', valid: false };
	}
	if (!config.frontends?.length) {
		return { message: 'At least one frontend framework must be selected', valid: false };
	}
	if (config.orm && config.databaseEngine === 'none') {
		return { message: 'Cannot select an ORM without selecting a database engine', valid: false };
	}

	return { message: '', valid: true };
};

const executeProjectGeneration = async (config: PlaygroundConfig, tempDir: string): Promise<GenerateResult> => {
	const result = await runCreateAbsoluteJS(config, tempDir);

	if (!result.success) {
		return {
			errorMessage: `CLI failed: ${result.output.slice(0, OUTPUT_PREVIEW_LENGTH)}`, errorType: 'Internal Server Error', success: false
		};
	}

	const projectDir = join(tempDir, config.projectName);
	const files = await readAllFiles(projectDir, projectDir);

	if (!files.length) {
		return {
			errorMessage: 'No files were generated', errorType: 'Internal Server Error', success: false
		};
	}

	generatedProjects.set(config.projectName, { dir: projectDir, timestamp: Date.now() });

	return {
		cliCommand: `bun ${buildCliArgs(config).join(' ')}`, cliOutput: result.output, files, message: 'Project generated successfully', success: true
	};
};

export const sandboxPlugin = () =>
	new Elysia({ prefix: '/api/v1/sandbox' })
		.onError(({ code, error }) => {
			console.warn('Sandbox error:', code, error);
		})
		.post(
			'/generate',
			async ({ body, error }) => {
				const config = body as PlaygroundConfig;
				const validation = validateConfig(config);

				if (!validation.valid) {
					return error('Bad Request', validation.message);
				}

				const tempDir = join(tmpdir(), `absolutejs-playground-${Date.now()}`);
				await mkdir(tempDir, { recursive: true });

				let result: GenerateResult;
				try {
					result = await executeProjectGeneration(config, tempDir);
				} catch (err) {
					rm(tempDir, { force: true, recursive: true }).catch(ignoreError);

					return error('Internal Server Error', `Failed to generate: ${err instanceof Error ? err.message : 'Unknown error'}`);
				}

				if (!result.success) {
					return error(result.errorType, result.errorMessage);
				}

				return result;
			},
			{
				body: t.Object({
					authProvider: t.Union([t.Literal('none'), t.Literal('absoluteAuth')]),
					codeQualityTool: t.Union([t.Literal('eslint+prettier'), t.Literal('biome')]),
					configurationType: t.Union([t.Literal('default'), t.Literal('custom')]),
					databaseEngine: t.Union([
						t.Literal('none'), t.Literal('postgresql'), t.Literal('sqlite'),
						t.Literal('mysql'), t.Literal('mariadb'), t.Literal('gel'),
						t.Literal('mongodb'), t.Literal('singlestore'), t.Literal('cockroachdb'), t.Literal('mssql')
					]),
					databaseHost: t.Optional(t.Union([
						t.Literal('none'), t.Literal('neon'), t.Literal('planetscale'), t.Literal('turso')
					])),
					frontends: t.Array(t.String()),
					gitInit: t.Boolean(),
					installDeps: t.Boolean(),
					orm: t.Optional(t.Union([t.Literal('drizzle'), t.Literal('prisma')])),
					projectName: t.String(),
					selectedPlugins: t.Array(t.Union([
						t.Literal('@elysiajs/cors'), t.Literal('@elysiajs/swagger'), t.Literal('elysia-rate-limit')
					])),
					useHtmlScripts: t.Boolean(),
					useTailwind: t.Boolean()
				})
			}
		)
		.post(
			'/download',
			async ({ body, error, set }) => {
				const { projectName } = body as { projectName: string };
				const project = generatedProjects.get(projectName);

				if (!project) {
					return error('Not Found', 'Project not found. It may have expired. Please generate again.');
				}

				try {
					await stat(project.dir);
					const zipBuffer = await createZipArchive(project.dir);

					set.headers['Content-Type'] = 'application/zip';
					set.headers['Content-Disposition'] = `attachment; filename="${projectName}.zip"`;

					return zipBuffer;
				} catch (err) {
					console.error('ZIP error:', err);

					return error('Internal Server Error', 'Failed to create ZIP archive');
				}
			},
			{ body: t.Object({ projectName: t.String() }) }
		);
