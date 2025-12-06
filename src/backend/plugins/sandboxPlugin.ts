import { Buffer } from 'node:buffer';
import { spawn } from 'node:child_process';
import { mkdir, rm, readdir, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import process from 'node:process';
import { Writable } from 'node:stream';
import archiver from 'archiver';
import { Elysia, t } from 'elysia';

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * BYTES_PER_KB;
const MS_PER_MINUTE = 60_000;
const MAX_AGE_MINUTES = 30;
const CLEANUP_INTERVAL_MINUTES = 5;
const MAX_AGE_MS = MAX_AGE_MINUTES * MS_PER_MINUTE;
const CLEANUP_INTERVAL_MS = CLEANUP_INTERVAL_MINUTES * MS_PER_MINUTE;
const PROMPT_DELAY_MS = 500;
const STDIN_CLOSE_DELAY_MS = 3000;
const OUTPUT_PREVIEW_LENGTH = 500;
const ZIP_COMPRESSION_LEVEL = 9;

const SPAWN_ENV: Record<string, string | undefined> = {
	...process.env,
	CI: 'true',
	TERM: 'dumb'
};

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

type ProjectData = { 
	dir: string; 
	timestamp: number 
};

type CliResult = { 
	exitCode: number; 
	output: string; 
	success: boolean 
};

type ValidationResult = { 
	isValid: boolean; 
	message: string 
};

type OutputRef = { 
	value: string 
};

type GenerateResult = {
	success: true;
	cliCommand: string;
	cliOutput: string;
	files: GeneratedFile[];
	message: string;
} | {
	success: false;
	errorType: 'Internal Server Error';
	errorMessage: string;
};

const generatedProjects = new Map<string, ProjectData>();

const ignoreError = () => {
	// Intentionally empty 
};

const isExpired = (timestamp: number, now: number) => now - timestamp > MAX_AGE_MS;

const cleanupProject = (projectName: string, data: ProjectData, now: number) => {
	if (!isExpired(data.timestamp, now)) {
		return;
	}

	rm(data.dir, { force: true, recursive: true }).catch(ignoreError);
	generatedProjects.delete(projectName);
};

const runCleanup = () => {
	const now = Date.now();

	for (const [projectName, data] of generatedProjects.entries()) {
		cleanupProject(projectName, data, now);
	}
};

setInterval(runCleanup, CLEANUP_INTERVAL_MS);

const addDatabaseArgs = (args: string[], config: PlaygroundConfig) => {
	args.push('--db', config.databaseEngine);

	if (config.databaseHost && config.databaseHost !== 'none') {
		args.push('--db-host', config.databaseHost);
	}

	if (config.orm) {
		args.push('--orm', config.orm);
	}
};

const buildCliArgs = (config: PlaygroundConfig) => {
	const args = ['create', 'absolutejs', config.projectName, '--skip'];

	args.push(config.codeQualityTool === 'biome' ? '--biome' : '--eslint+prettier');

	for (const frontend of config.frontends) {
		args.push(`--${frontend}`);
	}

	if (config.useTailwind) {
		args.push('--tailwind');
	}

	if (config.useHtmlScripts) {
		args.push('--html-scripts');
	}

	if (config.databaseEngine !== 'none') {
		addDatabaseArgs(args, config);
	}

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

const writeToStdin = (stdin: Writable, answer: string) => {
	if (stdin.destroyed) {
		return;
	}

	try {
		stdin.write(answer);
	} catch {
		// Ignore write errors
	}
};

const closeStdin = (stdin: Writable) => {
	if (stdin.destroyed) {
		return;
	}

	try {
		stdin.end();
	} catch {
		// Ignore close errors
	}
};

const setupPromptAnswers = (stdin: Writable) => {
	const answers = ['n\n', 'n\n', 'y\n', 'n\n', 'y\n'];

	answers.forEach((answer, index) => {
		setTimeout(() => writeToStdin(stdin, answer), PROMPT_DELAY_MS * (index + 1));
	});

	setTimeout(() => closeStdin(stdin), STDIN_CLOSE_DELAY_MS);
};

const runCreateAbsoluteJS = (
	config: PlaygroundConfig,
	workDir: string
// eslint-disable-next-line promise/avoid-new -- Wrapping callback-based archiver API
) => new Promise<CliResult>((resolve) => {
	const outputRef: OutputRef = { value: '' };
	const errorRef: OutputRef = { value: '' };
	const args = buildCliArgs(config);

	console.warn(`Sandbox Running: bun ${args.join(' ')}`);
	console.warn(`Sandbox Working directory: ${workDir}`);

	const proc = spawn('bun', args, {
		cwd: workDir,
		env: SPAWN_ENV,
		stdio: ['pipe', 'pipe', 'pipe']
	});

	setupPromptAnswers(proc.stdin);

	proc.stdout.on('data', (data: Buffer) => {
		const text = data.toString();
		outputRef.value += text;
		console.warn(`Sandbox stdout ${text}`);
	});

	proc.stderr.on('data', (data: Buffer) => {
		const text = data.toString();
		errorRef.value += text;
		console.warn(`Sandbox stderr ${text}`);
	});

	proc.on('close', (code: number | null) => {
		console.warn(`Sandbox Process exited: ${code}`);
		const output = errorRef.value
			? `${outputRef.value}\nstderr\n${errorRef.value}`
			: outputRef.value;

		resolve({ exitCode: code || 0, output, success: code === 0 });
	});

	proc.on('error', (err: Error) => {
		console.error(`Sandbox Process error:`, err);
		resolve({ exitCode: 1, output: `Failed to start process: ${err.message}`, success: false });
	});
});

const processFileContent = async (fullPath: string, relativePath: string, files: GeneratedFile[]) => {
	const stats = await stat(fullPath).catch(() => null);

	if (stats === null) {
		files.push({ content: 'Binary file or unable to read', path: relativePath });

		return;
	}

	if (stats.size > BYTES_PER_MB) {
		const sizeMB = (stats.size / BYTES_PER_MB).toFixed(2);
		files.push({ content: `File too large: ${sizeMB} MB`, path: relativePath });

		return;
	}

	const content = await readFile(fullPath, 'utf-8').catch(() => null);

	if (content === null) {
		files.push({ content: 'Unable to read', path: relativePath });

		return;
	}

	files.push({ content, path: relativePath });
};

const shouldSkipEntry = (name: string) => name === 'node_modules' || name === '.git';

const processEntry = async (
	entry: { name: string; isDirectory: () => boolean },
	dir: string,
	baseDir: string,
	files: GeneratedFile[]
) => {
	if (shouldSkipEntry(entry.name)) {
		return;
	}

	const fullPath = join(dir, entry.name);
	const relativePath = relative(baseDir, fullPath);

	if (entry.isDirectory()) {
		await readAllFiles(fullPath, baseDir, files);

		return;
	}

	await processFileContent(fullPath, relativePath, files);
};

const readAllFiles = async (
	dir: string,
	baseDir: string,
	files: GeneratedFile[] = []
) => {
	const entries = await readdir(dir, { withFileTypes: true });

	await Promise.all(entries.map((entry) => processEntry(entry, dir, baseDir, files)));

	return files;
};

// eslint-disable-next-line promise/avoid-new -- Wrapping callback-based archiver API
const createZipArchive = (projectDir: string) => new Promise<Buffer>((resolve, reject) => {
	const chunks: Buffer[] = [];
	const archive = archiver('zip', { zlib: { level: ZIP_COMPRESSION_LEVEL } });

	archive.on('data', (chunk: Buffer) => chunks.push(chunk));
	archive.on('end', () => resolve(Buffer.concat(chunks)));
	archive.on('error', reject);
	archive.directory(projectDir, false);
	archive.finalize();
});

const validateConfig = (config: PlaygroundConfig): ValidationResult => {
	if (!config.projectName || config.projectName.trim() === '') {
		return { isValid: false, message: 'Project name is required' };
	}

	if (!/^[a-zA-Z0-9_-]+$/.test(config.projectName)) {
		return { isValid: false, message: 'Project name can only contain letters, numbers, dashes, and underscores' };
	}

	if (!config.frontends || config.frontends.length === 0) {
		return { isValid: false, message: 'At least one frontend framework must be selected' };
	}

	if (config.orm && config.databaseEngine === 'none') {
		return { isValid: false, message: 'Cannot select an ORM without selecting a database engine' };
	}

	return { isValid: true, message: '' };
};

const executeProjectGeneration = async (config: PlaygroundConfig, tempDir: string) => {
	const result = await runCreateAbsoluteJS(config, tempDir);

	if (!result.success) {
		console.error(`Sandbox CLI failed ${result.exitCode}`);

		const errorResult: GenerateResult = {
			errorMessage: `CLI failed: ${result.output.slice(0, OUTPUT_PREVIEW_LENGTH)}`,
			errorType: 'Internal Server Error',
			success: false
		};

		return errorResult;
	}

	const projectDir = join(tempDir, config.projectName);
	const files = await readAllFiles(projectDir, projectDir);

	if (files.length === 0) {
		const errorResult: GenerateResult = {
			errorMessage: 'No files were generated',
			errorType: 'Internal Server Error',
			success: false
		};

		return errorResult;
	}

	generatedProjects.set(config.projectName, { dir: projectDir, timestamp: Date.now() });

	const args = buildCliArgs(config);
	const successResult: GenerateResult = {
		cliCommand: `bun ${args.join(' ')}`,
		cliOutput: result.output,
		files,
		message: 'Project generated successfully',
		success: true
	};

	return successResult;
};

export const sandboxPlugin = () =>
	new Elysia({ prefix: '/api/v1/sandbox' })
		.onError(({ code, error }) => {
			console.warn('Sandbox Error code:', code);
			console.warn('Sandbox Error:', error);
		})
		.post(
			'/generate',
			async ({ body, error }) => {
				console.warn('Sandbox Received body:', JSON.stringify(body, null, 2));
				const config = body as PlaygroundConfig;

				const validation = validateConfig(config);

				if (!validation.isValid) {
					return error('Bad Request', validation.message);
				}

				const tempDir = join(tmpdir(), `absolutejs-playground-${Date.now()}`);
				await mkdir(tempDir, { recursive: true });

				let result: GenerateResult;

				try {
					result = await executeProjectGeneration(config, tempDir);
				} catch (err) {
					console.error('Sandbox Error:', err);
					const errorMessage = err instanceof Error ? err.message : 'Unknown error';

					rm(tempDir, { force: true, recursive: true }).catch(ignoreError);

					result = {
						errorMessage: `Failed to generate project: ${errorMessage}`,
						errorType: 'Internal Server Error',
						success: false
					};
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
						t.Literal('none'),
						t.Literal('postgresql'),
						t.Literal('sqlite'),
						t.Literal('mysql'),
						t.Literal('mariadb'),
						t.Literal('gel'),
						t.Literal('mongodb'),
						t.Literal('singlestore'),
						t.Literal('cockroachdb'),
						t.Literal('mssql')
					]),
					databaseHost: t.Optional(t.Union([
						t.Literal('none'),
						t.Literal('neon'),
						t.Literal('planetscale'),
						t.Literal('turso')
					])),
					frontends: t.Array(t.String()),
					gitInit: t.Boolean(),
					installDeps: t.Boolean(),
					orm: t.Optional(t.Union([t.Literal('drizzle'), t.Literal('prisma')])),
					projectName: t.String(),
					selectedPlugins: t.Array(t.Union([
						t.Literal('@elysiajs/cors'),
						t.Literal('@elysiajs/swagger'),
						t.Literal('elysia-rate-limit')
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
			{
				body: t.Object({
					projectName: t.String()
				})
			}
		);
