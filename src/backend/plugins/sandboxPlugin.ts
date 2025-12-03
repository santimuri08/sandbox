/**
 * sandboxPlugin.ts
 *
 * WHERE IT GOES:
 * src/backend/plugins/sandboxPlugin.ts
 */

import { Buffer } from 'node:buffer';
import { spawn } from 'node:child_process';
import { mkdir, rm, readdir, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import process from 'node:process';
import { Writable } from 'node:stream';
import archiver from 'archiver';
import { Elysia, t } from 'elysia';

// ============================================================================
// CONSTANTS
// ============================================================================

const CLEANUP_INTERVAL_MINUTES = 30;
const CLEANUP_CHECK_MINUTES = 5;
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;
const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * BYTES_PER_KB;
const PROMPT_ANSWER_DELAY_MS = 500;
const PROMPT_DELAY_MULTIPLIER_2 = 2;
const PROMPT_DELAY_MULTIPLIER_3 = 3;
const PROMPT_DELAY_MULTIPLIER_4 = 4;
const PROMPT_DELAY_MULTIPLIER_5 = 5;
const STDIN_CLOSE_DELAY_MS = 3000;
const OUTPUT_PREVIEW_LENGTH = 500;
const ZIP_COMPRESSION_LEVEL = 9;

const MAX_AGE_MS = CLEANUP_INTERVAL_MINUTES * SECONDS_PER_MINUTE * MS_PER_SECOND;
const CLEANUP_INTERVAL_MS = CLEANUP_CHECK_MINUTES * SECONDS_PER_MINUTE * MS_PER_SECOND;

const SPAWN_ENV: Record<string, string | undefined> = {
	...process.env,
	CI: 'true',
	TERM: 'dumb'
};

// ============================================================================
// TYPES
// ============================================================================

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
	timestamp: number;
};

type CliResult = {
	exitCode: number;
	output: string;
	success: boolean;
};

type PromptAnswer = {
	answer: string;
	delay: number;
};

type ValidationResult = {
	isValid: boolean;
	message: string;
};

// ============================================================================
// PROJECT CACHE
// ============================================================================

const generatedProjects = new Map<string, ProjectData>();

const ignoreError = () => {
	// Intentionally ignoring cleanup errors - project may already be deleted
};

const cleanupExpiredProjects = async (projectName: string, data: ProjectData, now: number) => {
	const isExpired = now - data.timestamp > MAX_AGE_MS;

	if (!isExpired) {
		return;
	}

	await rm(data.dir, { force: true, recursive: true }).catch(ignoreError);
	generatedProjects.delete(projectName);
};

const runCleanup = () => {
	const now = Date.now();

	for (const [projectName, data] of generatedProjects.entries()) {
		cleanupExpiredProjects(projectName, data, now).catch(ignoreError);
	}
};

setInterval(runCleanup, CLEANUP_INTERVAL_MS);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const addDatabaseArgs = (args: string[], config: PlaygroundConfig) => {
	if (config.databaseEngine === 'none') {
		return;
	}

	args.push('--db', config.databaseEngine);

	const dbHost = config.databaseHost;
	const hasDbHost = dbHost && dbHost !== 'none';

	if (hasDbHost) {
		args.push('--db-host', dbHost);
	}

	if (config.orm) {
		args.push('--orm', config.orm);
	}
};

const addPluginArgs = (args: string[], config: PlaygroundConfig) => {
	if (config.authProvider !== 'none') {
		args.push('--auth', config.authProvider);
	}

	for (const plugin of config.selectedPlugins) {
		args.push('--plugin', plugin);
	}

	args.push('--install');
};

const buildCliArgs = (config: PlaygroundConfig) => {
	const args: string[] = [
		'create',
		'absolutejs',
		config.projectName,
		'--skip'
	];

	if (config.codeQualityTool === 'biome') {
		args.push('--biome');
	} else {
		args.push('--eslint+prettier');
	}

	for (const frontend of config.frontends) {
		args.push(`--${frontend}`);
	}

	if (config.useTailwind) {
		args.push('--tailwind');
	}

	if (config.useHtmlScripts) {
		args.push('--html-scripts');
	}

	addDatabaseArgs(args, config);
	args.push('--directory', config.configurationType);
	addPluginArgs(args, config);

	return args;
};

const buildDisplayCommand = (config: PlaygroundConfig) => {
	const args = buildCliArgs(config);

	return `bun ${args.join(' ')}`;
};

const tryWriteToStdin = (stdin: Writable, content: string) => {
	const isStdinClosed = stdin.destroyed;

	if (isStdinClosed) {
		return;
	}

	try {
		stdin.write(content);
	} catch {
		// Ignore write errors if process already closed
	}
};

const tryCloseStdin = (stdin: Writable) => {
	const isStdinClosed = stdin.destroyed;

	if (isStdinClosed) {
		return;
	}

	try {
		stdin.end();
	} catch {
		// Ignore close errors
	}
};

const schedulePromptAnswer = (
	stdin: Writable,
	promptAnswer: PromptAnswer
) => {
	setTimeout(() => tryWriteToStdin(stdin, promptAnswer.answer), promptAnswer.delay);
};

const scheduleStdinClose = (stdin: Writable) => {
	setTimeout(() => tryCloseStdin(stdin), STDIN_CLOSE_DELAY_MS);
};

const setupPromptAnswers = (stdin: Writable) => {
	const answers: PromptAnswer[] = [
		{ answer: 'n\n', delay: PROMPT_ANSWER_DELAY_MS },
		{ answer: 'n\n', delay: PROMPT_ANSWER_DELAY_MS * PROMPT_DELAY_MULTIPLIER_2 },
		{ answer: 'y\n', delay: PROMPT_ANSWER_DELAY_MS * PROMPT_DELAY_MULTIPLIER_3 },
		{ answer: 'n\n', delay: PROMPT_ANSWER_DELAY_MS * PROMPT_DELAY_MULTIPLIER_4 },
		{ answer: 'y\n', delay: PROMPT_ANSWER_DELAY_MS * PROMPT_DELAY_MULTIPLIER_5 },
	];

	answers.forEach((promptAnswer) => schedulePromptAnswer(stdin, promptAnswer));
	scheduleStdinClose(stdin);
};

const handleStdout = (outputRef: { value: string }) => (data: Buffer) => {
	const text = data.toString();
	outputRef.value += text;
	console.warn(`[Sandbox stdout] ${text}`);
};

const handleStderr = (errorRef: { value: string }) => (data: Buffer) => {
	const text = data.toString();
	errorRef.value += text;
	console.warn(`[Sandbox stderr] ${text}`);
};

const handleProcessClose = (
	outputRef: { value: string },
	errorRef: { value: string },
	resolve: (result: CliResult) => void
) => (code: number | null) => {
	console.warn(`[Sandbox] Process exited with code: ${code}`);
	const fullOutput = errorRef.value ? `${outputRef.value}\n--- stderr ---\n${errorRef.value}` : outputRef.value;
	resolve({
		exitCode: code || 0,
		output: fullOutput,
		success: code === 0
	});
};

const handleProcessError = (resolve: (result: CliResult) => void) => (err: Error) => {
	console.error(`[Sandbox] Process error:`, err);
	resolve({
		exitCode: 1,
		output: `Failed to start process: ${err.message}`,
		success: false
	});
};

type OutputRef = { value: string };

const runCreateAbsoluteJS = (
	config: PlaygroundConfig,
	workDir: string
// eslint-disable-next-line promise/avoid-new -- Wrapping callback-based spawn API
) => new Promise<CliResult>((resolve) => {
	const outputRef: OutputRef = { value: '' };
	const errorRef: OutputRef = { value: '' };

	const args = buildCliArgs(config);

	console.warn(`[Sandbox] Running: bun ${args.join(' ')}`);
	console.warn(`[Sandbox] Working directory: ${workDir}`);

	const proc = spawn('bun', args, {
		cwd: workDir,
		env: SPAWN_ENV,
		stdio: ['pipe', 'pipe', 'pipe']
	});

	setupPromptAnswers(proc.stdin);

	proc.stdout.on('data', handleStdout(outputRef));
	proc.stderr.on('data', handleStderr(errorRef));
	proc.on('close', handleProcessClose(outputRef, errorRef, resolve));
	proc.on('error', handleProcessError(resolve));
});

const handleLargeFile = (
	relativePath: string,
	sizeBytes: number,
	files: GeneratedFile[]
) => {
	const sizeMB = (sizeBytes / BYTES_PER_MB).toFixed(2);
	files.push({
		content: `[File too large: ${sizeMB} MB]`,
		path: relativePath
	});
};

const handleUnreadableFile = (relativePath: string, files: GeneratedFile[]) => {
	files.push({
		content: '[Binary file or unable to read]',
		path: relativePath
	});
};

const processFile = async (
	fullPath: string,
	relativePath: string,
	files: GeneratedFile[]
) => {
	const stats = await stat(fullPath).catch(() => null);

	if (stats === null) {
		handleUnreadableFile(relativePath, files);

		return;
	}

	const isTooLarge = stats.size > BYTES_PER_MB;

	if (isTooLarge) {
		handleLargeFile(relativePath, stats.size, files);

		return;
	}

	const content = await readFile(fullPath, 'utf-8').catch(() => null);

	if (content === null) {
		handleUnreadableFile(relativePath, files);

		return;
	}

	files.push({ content, path: relativePath });
};

const shouldSkipEntry = (entryName: string) =>
	entryName === 'node_modules' || entryName === '.git';

const processFileEntry = async (
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

	await processFile(fullPath, relativePath, files);
};

const readAllFiles = async (
	dir: string,
	baseDir: string,
	files: GeneratedFile[] = []
) => {
	const entries = await readdir(dir, { withFileTypes: true });
	const processEntry = (entry: { name: string; isDirectory: () => boolean }) =>
		processFileEntry(entry, dir, baseDir, files);

	await Promise.all(entries.map(processEntry));

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

// ============================================================================
// VALIDATION
// ============================================================================

const validateProjectName = (projectName: string): ValidationResult => {
	if (!projectName || projectName.trim() === '') {
		return { isValid: false, message: 'Project name is required' };
	}

	const isValidFormat = /^[a-zA-Z0-9_-]+$/.test(projectName);

	if (!isValidFormat) {
		return {
			isValid: false,
			message: 'Project name can only contain letters, numbers, dashes, and underscores'
		};
	}

	return { isValid: true, message: '' };
};

const validateFrontends = (frontends: string[] | undefined): ValidationResult => {
	const hasFrontends = frontends && frontends.length > 0;

	if (!hasFrontends) {
		return {
			isValid: false,
			message: 'At least one frontend framework must be selected'
		};
	}

	return { isValid: true, message: '' };
};

const validateOrm = (orm: string | undefined, databaseEngine: string): ValidationResult => {
	const hasOrmWithoutDb = orm && databaseEngine === 'none';

	if (hasOrmWithoutDb) {
		return {
			isValid: false,
			message: 'Cannot select an ORM without selecting a database engine'
		};
	}

	return { isValid: true, message: '' };
};

// ============================================================================
// PLUGIN
// ============================================================================

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

const handleCliFailure = (result: CliResult): GenerateResult => {
	console.error(`[Sandbox] CLI failed with exit code ${result.exitCode}`);

	return {
		errorMessage: `CLI failed: ${result.output.slice(0, OUTPUT_PREVIEW_LENGTH)}`,
		errorType: 'Internal Server Error',
		success: false
	};
};

const EMPTY_FILES_ERROR: GenerateResult = {
	errorMessage: 'No files were generated',
	errorType: 'Internal Server Error',
	success: false
};

const handleGenerationSuccess = (
	config: PlaygroundConfig,
	result: CliResult,
	files: GeneratedFile[],
	projectDir: string
): GenerateResult => {
	const projectData: ProjectData = {
		dir: projectDir,
		timestamp: Date.now()
	};

	generatedProjects.set(config.projectName, projectData);

	const cliCommand = buildDisplayCommand(config);

	return {
		cliCommand,
		cliOutput: result.output,
		files,
		message: 'Project generated successfully',
		success: true
	};
};

const executeProjectGeneration = async (
	config: PlaygroundConfig,
	tempDir: string
) => {
	const result = await runCreateAbsoluteJS(config, tempDir);

	if (!result.success) {
		return handleCliFailure(result);
	}

	const projectDir = join(tempDir, config.projectName);
	const files = await readAllFiles(projectDir, projectDir);

	if (files.length === 0) {
		return EMPTY_FILES_ERROR;
	}

	return handleGenerationSuccess(config, result, files, projectDir);
};

const logSandboxError = (code: string | number, err: unknown) => {
	console.warn('[Sandbox] Error code:', code);
	console.warn('[Sandbox] Error:', err);

	const hasMessage = err && typeof err === 'object' && 'message' in err;

	if (hasMessage) {
		console.warn('[Sandbox] Error message:', (err as { message: string }).message);
	}
};

export const sandboxPlugin = () =>
	new Elysia({ prefix: '/api/v1/sandbox' })
		.onError(({ code, error }) => {
			logSandboxError(code, error);
		})
		.post(
			'/generate',
			async ({ body, error }) => {
				console.warn('[Sandbox] Received body:', JSON.stringify(body, null, 2));
				const config = body as PlaygroundConfig;

				console.warn(`[Sandbox] Generating project: ${config.projectName}`);

				const nameValidation = validateProjectName(config.projectName);

				if (!nameValidation.isValid) {
					return error('Bad Request', nameValidation.message);
				}

				const frontendsValidation = validateFrontends(config.frontends);

				if (!frontendsValidation.isValid) {
					return error('Bad Request', frontendsValidation.message);
				}

				const ormValidation = validateOrm(config.orm, config.databaseEngine);

				if (!ormValidation.isValid) {
					return error('Bad Request', ormValidation.message);
				}

				const tempDir = join(tmpdir(), `absolutejs-playground-${Date.now()}`);
				await mkdir(tempDir, { recursive: true });

				let result: GenerateResult;

				try {
					result = await executeProjectGeneration(config, tempDir);
				} catch (err) {
					console.error('[Sandbox] Error:', err);
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
					codeQualityTool: t.Union([
						t.Literal('eslint+prettier'),
						t.Literal('biome')
					]),
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
					databaseHost: t.Optional(
						t.Union([
							t.Literal('none'),
							t.Literal('neon'),
							t.Literal('planetscale'),
							t.Literal('turso')
						])
					),
					frontends: t.Array(t.String()),
					gitInit: t.Boolean(),
					installDeps: t.Boolean(),
					orm: t.Optional(t.Union([t.Literal('drizzle'), t.Literal('prisma')])),
					projectName: t.String(),
					selectedPlugins: t.Array(
						t.Union([
							t.Literal('@elysiajs/cors'),
							t.Literal('@elysiajs/swagger'),
							t.Literal('elysia-rate-limit')
						])
					),
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
					console.error('[Sandbox] ZIP error:', err);

					return error('Internal Server Error', 'Failed to create ZIP archive');
				}
			},
			{
				body: t.Object({
					projectName: t.String()
				})
			}
		);