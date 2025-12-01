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
}
export function buildCliCommand(config: PlaygroundConfig): string {
	const parts: string[] = [];
	parts.push('bun create absolutejs');
	parts.push(config.projectName);
	if (config.configurationType === 'custom') {
		parts.push('--config custom');
	}
	for (const frontend of config.frontends) {
		parts.push(`--${frontend}`);
	}
	if (config.databaseEngine !== 'none') {
		parts.push(`--db ${config.databaseEngine}`);
		if (config.databaseHost && config.databaseHost !== 'none') {
			parts.push(`--db-host ${config.databaseHost}`);
		}
		if (config.orm) {
			parts.push(`--orm ${config.orm}`);
		}
	}
	if (config.authProvider !== 'none') {
		parts.push(`--auth ${config.authProvider}`);
	}
	parts.push(`--code-quality ${config.codeQualityTool}`);
	if (config.useTailwind) {
		parts.push('--tailwind');
	}
	if (config.useHtmlScripts) {
		parts.push('--html-scripts');
	}
	for (const plugin of config.selectedPlugins) {
		parts.push(`--plugin ${plugin}`);
	}
	return parts.join(' ');
}
export function validatePlaygroundConfig(config: PlaygroundConfig): string[] {
	const errors: string[] = [];
	if (!config.projectName || config.projectName.trim() === '') {
		errors.push('Project name is required');
	}
	if (config.projectName && !/^[a-zA-Z0-9_-]+$/.test(config.projectName)) {
		errors.push('Project name can only contain letters, numbers, dashes, and underscores');
	}
	if (config.frontends.length === 0) {
		errors.push('At least one frontend framework must be selected');
	}
	if (config.databaseEngine !== 'none') {
		if (config.databaseEngine === 'postgresql') {
		}
	}
	if (config.orm && config.databaseEngine === 'none') {
		errors.push('Cannot select an ORM without selecting a database engine');
	}
	return errors;
}