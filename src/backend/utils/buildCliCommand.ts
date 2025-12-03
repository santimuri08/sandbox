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

const putDatabaseStuff = (parts: string[], config: PlaygroundConfig) => {
	const dbEngine = config.databaseEngine;
	parts.push(`--db ${  dbEngine}`);
	const dbHost = config.databaseHost;
	const hostExists = dbHost !== undefined && dbHost !== 'none';
	if (hostExists) {
		parts.push(`--db-host ${  dbHost}`);
	}
	const ormValue = config.orm;
	if (ormValue !== undefined) {
		parts.push(`--orm ${  ormValue}`);
	}
};

const putPlugins = (parts: string[], plugins: PluginValue[]) => {
	let idx = 0;
	while (idx < plugins.length) {
		const plug = plugins[idx];
		parts.push(`--plugin ${  plug}`);
		idx = idx + 1;
	}
};

const nameFormatIsOk = (name: string) => {
	const pattern = /^[a-zA-Z0-9_-]+$/;
	const result = pattern.test(name);

	return result;
};

export const buildCliCommand = (config: PlaygroundConfig) => {
	const parts: string[] = [];
	parts.push('bun create absolutejs');
	parts.push(config.projectName);
	parts.push('--skip');
	const tool = config.codeQualityTool;
	if (tool === 'biome') {
		parts.push('--biome');
	} else {
		parts.push('--eslint+prettier');
	}
	const fends = config.frontends;
	let idx = 0;
	while (idx < fends.length) {
		parts.push(`--${  fends[idx]}`);
		idx = idx + 1;
	}
	const tailwind = config.useTailwind;
	if (tailwind === true) {
		parts.push('--tailwind');
	}
	const html = config.useHtmlScripts;
	if (html === true) {
		parts.push('--html-scripts');
	}
	const dbEng = config.databaseEngine;
	if (dbEng !== 'none') {
		putDatabaseStuff(parts, config);
	}
	const dirType = config.configurationType;
	parts.push(`--directory ${  dirType}`);
	const auth = config.authProvider;
	if (auth !== 'none') {
		parts.push(`--auth ${  auth}`);
	}
	putPlugins(parts, config.selectedPlugins);
	const git = config.gitInit;
	if (git === true) {
		parts.push('--git');
	}
	const inst = config.installDeps;
	if (inst === true) {
		parts.push('--install');
	}
	const cmd = parts.join(' ');

	return cmd;
};

export const validatePlaygroundConfig = (config: PlaygroundConfig) => {
	const errs: string[] = [];
	const name = config.projectName;
	const nameEmpty = !name || name.trim() === '';
	if (nameEmpty) {
		errs.push('Project name is required');
	}
	if (name && nameFormatIsOk(name) === false) {
		errs.push('Project name can only contain letters, numbers, dashes, and underscores');
	}
	const fends = config.frontends;
	if (fends.length === 0) {
		errs.push('At least one frontend framework must be selected');
	}
	const hasOrm = config.orm !== undefined;
	const noDb = config.databaseEngine === 'none';
	if (hasOrm && noDb) {
		errs.push('Cannot select an ORM without selecting a database engine');
	}

	return errs;
};