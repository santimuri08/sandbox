/**
 * buildCliCommand.ts
 *
 * WHERE IT GOES:
 * src/backend/utils/buildCliCommand.ts (replace existing)
 */

export type DatabaseEngine =
	| 'none'
	| 'postgresql'
	| 'sqlite'
	| 'mysql'
	| 'mariadb'
	| 'gel'
	| 'mongodb';
export type ORM = 'drizzle' | 'prisma' | undefined;
export type CodeQualityTool = 'eslint+prettier' | 'biome';
export type AuthProvider = 'none' | 'absoluteAuth';
export type ConfigurationType = 'default' | 'custom';
export type DatabaseHost = 'none' | 'neon' | 'planetscale' | 'turso' | undefined;
export type PluginValue = '@elysiajs/cors' | '@elysiajs/swagger' | 'elysia-rate-limit';

export interface PlaygroundConfig {
	projectName: string;
	configurationType: ConfigurationType;
	frontends: string[];
	databaseEngine: DatabaseEngine;
	databaseHost: DatabaseHost;
	orm: ORM;
	authProvider: AuthProvider;
	codeQualityTool: CodeQualityTool;
	useTailwind: boolean;
	useHtmlScripts: boolean;
	selectedPlugins: PluginValue[];
	gitInit: boolean;
	installDeps: boolean;
}

const addDatabaseArgs = (parts: string[], config: PlaygroundConfig) => {
	if (config.databaseEngine === 'none') {
		return;
	}

	parts.push(`--db ${config.databaseEngine}`);

	const dbHost = config.databaseHost;
	const hasValidHost = dbHost && dbHost !== 'none';

	if (hasValidHost) {
		parts.push(`--db-host ${dbHost}`);
	}

	if (config.orm) {
		parts.push(`--orm ${config.orm}`);
	}
};

const addPluginArgs = (parts: string[], config: PlaygroundConfig) => {
	for (const plugin of config.selectedPlugins) {
		parts.push(`--plugin ${plugin}`);
	}
};

export const buildCliCommand = (config: PlaygroundConfig) => {
	const parts: string[] = [];

	parts.push('bun create absolutejs');
	parts.push(config.projectName);
	parts.push('--skip');

	if (config.codeQualityTool === 'biome') {
		parts.push('--biome');
	} else {
		parts.push('--eslint+prettier');
	}

	for (const frontend of config.frontends) {
		parts.push(`--${frontend}`);
	}

	if (config.useTailwind) {
		parts.push('--tailwind');
	}

	if (config.useHtmlScripts) {
		parts.push('--html-scripts');
	}

	addDatabaseArgs(parts, config);

	parts.push(`--directory ${config.configurationType}`);

	if (config.authProvider !== 'none') {
		parts.push(`--auth ${config.authProvider}`);
	}

	addPluginArgs(parts, config);

	if (config.gitInit) {
		parts.push('--git');
	}

	if (config.installDeps) {
		parts.push('--install');
	}

	return parts.join(' ');
};

const validateProjectNameFormat = (projectName: string, errors: string[]) => {
	const isInvalidFormat = !/^[a-zA-Z0-9_-]+$/.test(projectName);

	if (isInvalidFormat) {
		errors.push('Project name can only contain letters, numbers, dashes, and underscores');
	}
};

export const validatePlaygroundConfig = (config: PlaygroundConfig) => {
	const errors: string[] = [];

	if (!config.projectName || config.projectName.trim() === '') {
		errors.push('Project name is required');
	}

	if (config.projectName) {
		validateProjectNameFormat(config.projectName, errors);
	}

	if (config.frontends.length === 0) {
		errors.push('At least one frontend framework must be selected');
	}

	if (config.orm && config.databaseEngine === 'none') {
		errors.push('Cannot select an ORM without selecting a database engine');
	}

	return errors;
};