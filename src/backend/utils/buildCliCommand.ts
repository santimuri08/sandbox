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
	parts.push(`--db ${config.databaseEngine}`);
	
	if (config.databaseHost && config.databaseHost !== 'none') {
		parts.push(`--db-host ${config.databaseHost}`);
	}
	
	if (config.orm) {
		parts.push(`--orm ${config.orm}`);
	}
};

const addPluginArgs = (parts: string[], plugins: PluginValue[]) => {
	for (const plugin of plugins) {
		parts.push(`--plugin ${plugin}`);
	}
};

export const buildCliCommand = (config: PlaygroundConfig) => {
	const parts: string[] = ['bun create absolutejs', config.projectName, '--skip'];

	parts.push(config.codeQualityTool === 'biome' ? '--biome' : '--eslint+prettier');

	for (const frontend of config.frontends) {
		parts.push(`--${frontend}`);
	}

	if (config.useTailwind) {
		parts.push('--tailwind');
	}

	if (config.useHtmlScripts) {
		parts.push('--html-scripts');
	}

	if (config.databaseEngine !== 'none') {
		addDatabaseArgs(parts, config);
	}

	parts.push(`--directory ${config.configurationType}`);

	if (config.authProvider !== 'none') {
		parts.push(`--auth ${config.authProvider}`);
	}

	addPluginArgs(parts, config.selectedPlugins);

	if (config.gitInit) {
		parts.push('--git');
	}

	if (config.installDeps) {
		parts.push('--install');
	}

	return parts.join(' ');
};

export const validatePlaygroundConfig = (config: PlaygroundConfig) => {
	const errors: string[] = [];

	if (!config.projectName?.trim()) {
		errors.push('Project name is required');
	} else if (!/^[a-zA-Z0-9_-]+$/.test(config.projectName)) {
		errors.push('Project name can only contain letters, numbers, dashes, and underscores');
	}

	if (!config.frontends.length) {
		errors.push('At least one frontend framework must be selected');
	}

	if (config.orm && config.databaseEngine === 'none') {
		errors.push('Cannot select an ORM without selecting a database engine');
	}

	return errors;
};