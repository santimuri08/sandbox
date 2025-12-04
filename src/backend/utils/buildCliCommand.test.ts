/* eslint-disable import/no-unused-modules */
import { describe, expect, it } from 'bun:test';
import { buildCliCommand, validatePlaygroundConfig, type PlaygroundConfig } from './buildCliCommand';

const makeConfig = (overrides: Partial<PlaygroundConfig> = {}): PlaygroundConfig => ({
	authProvider: 'none',
	codeQualityTool: 'eslint+prettier',
	configurationType: 'default',
	databaseEngine: 'none',
	databaseHost: undefined,
	frontends: ['react'],
	gitInit: false,
	installDeps: false,
	orm: undefined,
	projectName: 'my-app',
	selectedPlugins: [],
	useHtmlScripts: false,
	useTailwind: false,
	...overrides
});

describe('buildCliCommand', () => {
	it('generates basic command with react frontend', () => {
		const config = makeConfig();
		const cmd = buildCliCommand(config);
		
		expect(cmd).toContain('bun create absolutejs my-app');
		expect(cmd).toContain('--react');
		expect(cmd).toContain('--eslint+prettier');
	});

	it('adds tailwind flag when enabled', () => {
		const config = makeConfig({ useTailwind: true });
		const cmd = buildCliCommand(config);
		
		expect(cmd).toContain('--tailwind');
	});

	it('uses biome instead of eslint when selected', () => {
		const config = makeConfig({ codeQualityTool: 'biome' });
		const cmd = buildCliCommand(config);
		
		expect(cmd).toContain('--biome');
		expect(cmd).not.toContain('--eslint');
	});

	it('adds database flags correctly', () => {
		const config = makeConfig({
			databaseEngine: 'postgresql',
			databaseHost: 'neon',
			orm: 'drizzle'
		});
		const cmd = buildCliCommand(config);
		
		expect(cmd).toContain('--db postgresql');
		expect(cmd).toContain('--db-host neon');
		expect(cmd).toContain('--orm drizzle');
	});

	it('adds multiple frontends', () => {
		const config = makeConfig({ frontends: ['react', 'htmx', 'vue'] });
		const cmd = buildCliCommand(config);
		
		expect(cmd).toContain('--react');
		expect(cmd).toContain('--htmx');
		expect(cmd).toContain('--vue');
	});

	it('adds plugins correctly', () => {
		const config = makeConfig({
			selectedPlugins: ['@elysiajs/cors', '@elysiajs/swagger']
		});
		const cmd = buildCliCommand(config);
		
		expect(cmd).toContain('--plugin @elysiajs/cors');
		expect(cmd).toContain('--plugin @elysiajs/swagger');
	});

	it('adds git and install flags', () => {
		const config = makeConfig({ gitInit: true, installDeps: true });
		const cmd = buildCliCommand(config);
		
		expect(cmd).toContain('--git');
		expect(cmd).toContain('--install');
	});

	it('handles auth provider', () => {
		const config = makeConfig({ authProvider: 'absoluteAuth' });
		const cmd = buildCliCommand(config);
		
		expect(cmd).toContain('--auth absoluteAuth');
	});
});

describe('validatePlaygroundConfig', () => {
	it('returns error for empty project name', () => {
		const config = makeConfig({ projectName: '' });
		const errors = validatePlaygroundConfig(config);
		
		expect(errors).toContain('Project name is required');
	});

	it('returns error for invalid characters in name', () => {
		const config = makeConfig({ projectName: 'my app!' });
		const errors = validatePlaygroundConfig(config);
		
		expect(errors).toContain('Project name can only contain letters, numbers, dashes, and underscores');
	});

	it('returns error when no frontends selected', () => {
		const config = makeConfig({ frontends: [] });
		const errors = validatePlaygroundConfig(config);
		
		expect(errors).toContain('At least one frontend framework must be selected');
	});

	it('returns error for ORM without database', () => {
		const config = makeConfig({ databaseEngine: 'none', orm: 'drizzle' });
		const errors = validatePlaygroundConfig(config);
		
		expect(errors).toContain('Cannot select an ORM without selecting a database engine');
	});

	it('returns empty array for valid config', () => {
		const config = makeConfig();
		const errors = validatePlaygroundConfig(config);
		
		expect(errors).toHaveLength(0);
	});
});