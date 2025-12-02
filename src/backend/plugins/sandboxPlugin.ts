import { Elysia, t } from 'elysia';
import { mkdir, rm, readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import archiver from 'archiver';

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
const generatedProjects = new Map<string, { dir: string; timestamp: number }>();
setInterval(() => {
	const now = Date.now();
	const maxAge = 30 * 60 * 1000;

	for (const [projectName, data] of generatedProjects.entries()) {
		if (now - data.timestamp > maxAge) {
			rm(data.dir, { recursive: true, force: true }).catch(() => { });
			generatedProjects.delete(projectName);
		}
	}
}, 5 * 60 * 1000);
function buildCliArgs(config: PlaygroundConfig): string[] {
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
	if (config.databaseEngine !== 'none') {
		args.push('--db', config.databaseEngine);
		if (config.databaseHost && config.databaseHost !== 'none') {
			args.push('--db-host', config.databaseHost);
		}
		if (config.orm) {
			args.push('--orm', config.orm);
		}
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
}
function buildDisplayCommand(config: PlaygroundConfig): string {
	const args = buildCliArgs(config);
	return `bun ${args.join(' ')}`;
}
async function runCreateAbsoluteJS(
	config: PlaygroundConfig,
	workDir: string
): Promise<{ success: boolean; output: string; exitCode: number }> {
	const args = buildCliArgs(config);
	return new Promise((resolve) => {
		let output = '';
		let errorOutput = '';
		console.log(`[Sandbox] Running: bun ${args.join(' ')}`);
		console.log(`[Sandbox] Working directory: ${workDir}`);
		const proc = spawn('bun', args, {
			cwd: workDir,
			env: {
				...process.env,
				CI: 'true',
				TERM: 'dumb'
			},
			stdio: ['pipe', 'pipe', 'pipe']
		});
		const answers = [
			{ delay: 500, answer: 'n\n' }, 
			{ delay: 1000, answer: 'n\n' },  
			{ delay: 1500, answer: 'y\n' },  
			{ delay: 2000, answer: 'n\n' }, 
			{ delay: 2500, answer: 'y\n' }, 
		];
		answers.forEach(({ delay, answer }) => {
			setTimeout(() => {
				try {
					if (!proc.stdin.destroyed) {
						proc.stdin.write(answer);
					}
				} catch (e) {
				}
			}, delay);
		});
		setTimeout(() => {
			try {
				if (!proc.stdin.destroyed) {
					proc.stdin.end();
				}
			} catch (e) {
			}
		}, 3000);
		proc.stdout.on('data', (data) => {
			const text = data.toString();
			output += text;
			console.log(`[Sandbox stdout] ${text}`);
		});
		proc.stderr.on('data', (data) => {
			const text = data.toString();
			errorOutput += text;
			console.log(`[Sandbox stderr] ${text}`);
		});
		proc.on('close', (code) => {
			console.log(`[Sandbox] Process exited with code: ${code}`);
			resolve({
				success: code === 0,
				output: output + (errorOutput ? `\n--- stderr ---\n${errorOutput}` : ''),
				exitCode: code || 0
			});
		});
		proc.on('error', (err) => {
			console.error(`[Sandbox] Process error:`, err);
			resolve({
				success: false,
				output: `Failed to start process: ${err.message}`,
				exitCode: 1
			});
		});
	});
}
async function readAllFiles(
	dir: string,
	baseDir: string,
	files: GeneratedFile[] = []
): Promise<GeneratedFile[]> {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		const relativePath = relative(baseDir, fullPath);
		if (entry.name === 'node_modules' || entry.name === '.git') {
			continue;
		}
		if (entry.isDirectory()) {
			await readAllFiles(fullPath, baseDir, files);
		} else {
			try {
				const stats = await stat(fullPath);
				if (stats.size > 1024 * 1024) {
					files.push({
						path: relativePath,
						content: `[File too large: ${(stats.size / 1024 / 1024).toFixed(2)} MB]`
					});
					continue;
				}
				const content = await readFile(fullPath, 'utf-8');
				files.push({ path: relativePath, content });
			} catch {
				files.push({
					path: relativePath,
					content: '[Binary file or unable to read]'
				});
			}
		}
	}
	return files;
}
async function createZipArchive(projectDir: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		const archive = archiver('zip', { zlib: { level: 9 } });

		archive.on('data', (chunk) => chunks.push(chunk));
		archive.on('end', () => resolve(Buffer.concat(chunks)));
		archive.on('error', reject);

		archive.directory(projectDir, false);
		archive.finalize();
	});
}
export const sandboxPlugin = () =>
	new Elysia({ prefix: '/api/v1/sandbox' })
		.onError(({ error, code }) => {
			console.log('[Sandbox] Error code:', code);
			console.log('[Sandbox] Error:', error);
			if (error && typeof error === 'object' && 'message' in error) {
				console.log('[Sandbox] Error message:', (error as { message: string }).message);
			}
		})
		.post(
			'/generate',
			async ({ body, error }) => {
				console.log('[Sandbox] Received body:', JSON.stringify(body, null, 2));
				const config = body as PlaygroundConfig;

				console.log(`[Sandbox] Generating project: ${config.projectName}`);

				if (!config.projectName || config.projectName.trim() === '') {
					return error('Bad Request', 'Project name is required');
				}

				if (!/^[a-zA-Z0-9_-]+$/.test(config.projectName)) {
					return error(
						'Bad Request',
						'Project name can only contain letters, numbers, dashes, and underscores'
					);
				}
				if (!config.frontends || config.frontends.length === 0) {
					return error(
						'Bad Request',
						'At least one frontend framework must be selected'
					);
				}
				if (config.orm && config.databaseEngine === 'none') {
					return error(
						'Bad Request',
						'Cannot select an ORM without selecting a database engine'
					);
				}
				const tempDir = join(tmpdir(), `absolutejs-playground-${Date.now()}`);
				await mkdir(tempDir, { recursive: true });
				try {
					const { success, output, exitCode } = await runCreateAbsoluteJS(config, tempDir);

					if (!success) {
						console.error(`[Sandbox] CLI failed with exit code ${exitCode}`);
						return error('Internal Server Error', `CLI failed: ${output.slice(0, 500)}`);
					}
					const projectDir = join(tempDir, config.projectName);
					const files = await readAllFiles(projectDir, projectDir);
					if (files.length === 0) {
						return error('Internal Server Error', 'No files were generated');
					}
					generatedProjects.set(config.projectName, {
						dir: projectDir,
						timestamp: Date.now()
					});
					const cliCommand = buildDisplayCommand(config);
					return {
						success: true,
						message: 'Project generated successfully',
						cliCommand,
						cliOutput: output,
						files
					};
				} catch (err) {
					console.error('[Sandbox] Error:', err);
					const errorMessage = err instanceof Error ? err.message : 'Unknown error';
					await rm(tempDir, { recursive: true, force: true }).catch(() => { });
					return error('Internal Server Error', `Failed to generate project: ${errorMessage}`);
				}
			},
			{
				body: t.Object({
					projectName: t.String(),
					configurationType: t.Union([t.Literal('default'), t.Literal('custom')]),
					frontends: t.Array(t.String()),
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
					orm: t.Optional(t.Union([t.Literal('drizzle'), t.Literal('prisma')])),
					authProvider: t.Union([t.Literal('none'), t.Literal('absoluteAuth')]),
					codeQualityTool: t.Union([
						t.Literal('eslint+prettier'),
						t.Literal('biome')
					]),
					useTailwind: t.Boolean(),
					useHtmlScripts: t.Boolean(),
					selectedPlugins: t.Array(
						t.Union([
							t.Literal('@elysiajs/cors'),
							t.Literal('@elysiajs/swagger'),
							t.Literal('elysia-rate-limit')
						])
					),
					gitInit: t.Boolean(),
					installDeps: t.Boolean()
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