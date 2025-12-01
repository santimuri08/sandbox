import { Elysia, t } from 'elysia';
import { buildCliCommand, type PlaygroundConfig } from '../utils/buildCliCommand';
import { generateSandboxFiles } from '../utils/generateSandboxFiles';
import { createStackBlitzProject } from '../utils/createStackBlitzProject';
export const sandboxPlugin = () =>
	new Elysia({ prefix: '/api/v1/sandbox' })
		.post(
			'/generate',
			async ({ body, error }) => {
				try {
					const config = body as PlaygroundConfig;
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
					const cliCommand = buildCliCommand(config);
					const sandboxFiles = generateSandboxFiles(config);
					const stackBlitzProject = createStackBlitzProject(
						sandboxFiles,
						config.projectName
					);
					return {
						success: true,
						cliCommand,
						files: sandboxFiles,
						stackBlitzProject,
						message: 'Project generated successfully'
					};
				} catch (err) {
					console.error('Error generating sandbox:', err);
					return error('Internal Server Error', 'Failed to generate project. Please try again.');
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
						t.Literal('mongodb')
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
					)
				})
			}
		);