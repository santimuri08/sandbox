import { buildCliCommand, validatePlaygroundConfig, type PlaygroundConfig } from './buildCliCommand';

const log = (message: string, data?: unknown) => {
	if (data !== undefined) {
		console.warn(message, data);
	} else {
		console.warn(message);
	}
};

const basicConfig: PlaygroundConfig = {
	authProvider: 'absoluteAuth',
	codeQualityTool: 'eslint+prettier',
	configurationType: 'default',
	databaseEngine: 'postgresql',
	databaseHost: 'neon',
	frontends: ['react'],
	gitInit: false,
	installDeps: false,
	orm: 'drizzle',
	projectName: 'my-app',
	selectedPlugins: ['@elysiajs/cors'],
	useHtmlScripts: false,
	useTailwind: true
};

const multiConfig: PlaygroundConfig = {
	authProvider: 'none',
	codeQualityTool: 'biome',
	configurationType: 'custom',
	databaseEngine: 'none',
	databaseHost: undefined,
	frontends: ['react', 'htmx', 'vue'],
	gitInit: true,
	installDeps: false,
	orm: undefined,
	projectName: 'multi-framework-app',
	selectedPlugins: [],
	useHtmlScripts: true,
	useTailwind: false
};

const sqliteConfig: PlaygroundConfig = {
	authProvider: 'absoluteAuth',
	codeQualityTool: 'eslint+prettier',
	configurationType: 'default',
	databaseEngine: 'sqlite',
	databaseHost: 'turso',
	frontends: ['svelte'],
	gitInit: true,
	installDeps: true,
	orm: 'drizzle',
	projectName: 'sqlite-app',
	selectedPlugins: ['@elysiajs/swagger', 'elysia-rate-limit'],
	useHtmlScripts: false,
	useTailwind: true
};

const invalidConfig1: PlaygroundConfig = {
	authProvider: 'none',
	codeQualityTool: 'eslint+prettier',
	configurationType: 'default',
	databaseEngine: 'none',
	databaseHost: undefined,
	frontends: ['react'],
	gitInit: false,
	installDeps: false,
	orm: undefined,
	projectName: '',
	selectedPlugins: [],
	useHtmlScripts: false,
	useTailwind: false
};

const invalidConfig2: PlaygroundConfig = {
	authProvider: 'none',
	codeQualityTool: 'eslint+prettier',
	configurationType: 'default',
	databaseEngine: 'none',
	databaseHost: undefined,
	frontends: ['react'],
	gitInit: false,
	installDeps: false,
	orm: undefined,
	projectName: 'my app!',
	selectedPlugins: [],
	useHtmlScripts: false,
	useTailwind: false
};

const invalidConfig3: PlaygroundConfig = {
	authProvider: 'none',
	codeQualityTool: 'eslint+prettier',
	configurationType: 'default',
	databaseEngine: 'none',
	databaseHost: undefined,
	frontends: [],
	gitInit: false,
	installDeps: false,
	orm: undefined,
	projectName: 'my-app',
	selectedPlugins: [],
	useHtmlScripts: false,
	useTailwind: false
};

const invalidConfig4: PlaygroundConfig = {
	authProvider: 'none',
	codeQualityTool: 'eslint+prettier',
	configurationType: 'default',
	databaseEngine: 'none',
	databaseHost: undefined,
	frontends: ['react'],
	gitInit: false,
	installDeps: false,
	orm: 'drizzle',
	projectName: 'my-app',
	selectedPlugins: [],
	useHtmlScripts: false,
	useTailwind: false
};

export const runTests = () => {
	log('Testing CLI Command Builder...\n');

	log('Test 1: Basic Configuration');
	log('Config:', JSON.stringify(basicConfig, null, 2));
	const command1 = buildCliCommand(basicConfig);
	log('Generated Command:', command1);
	log('Expected: bun create absolutejs my-app --eslint+prettier --react --tailwind --db postgresql --db-host neon --orm drizzle --auth absoluteAuth --plugin @elysiajs/cors\n');

	log('Test 2: Multiple Frontends, No Database, With Git');
	log('Config:', JSON.stringify(multiConfig, null, 2));
	const command2 = buildCliCommand(multiConfig);
	log('Generated Command:', command2);
	log('Expected: bun create absolutejs multi-framework-app --biome --react --htmx --vue --html-scripts --directory custom --git\n');

	log('Test 3: SQLite with Turso, Git and Install');
	log('Config:', JSON.stringify(sqliteConfig, null, 2));
	const command3 = buildCliCommand(sqliteConfig);
	log('Generated Command:', command3);
	log('Expected: bun create absolutejs sqlite-app --eslint+prettier --svelte --tailwind --db sqlite --db-host turso --orm drizzle --auth absoluteAuth --plugin @elysiajs/swagger --plugin elysia-rate-limit --git --install\n');

	log('Test 4: Validation Tests');

	const errors1 = validatePlaygroundConfig(invalidConfig1);
	log('Invalid Config 1 (empty name):', errors1);
	log('Expected: ["Project name is required"]\n');

	const errors2 = validatePlaygroundConfig(invalidConfig2);
	log('Invalid Config 2 (invalid characters):', errors2);
	log('Expected: ["Project name can only contain letters, numbers, dashes, and underscores"]\n');

	const errors3 = validatePlaygroundConfig(invalidConfig3);
	log('Invalid Config 3 (no frontends):', errors3);
	log('Expected: ["At least one frontend framework must be selected"]\n');

	const errors4 = validatePlaygroundConfig(invalidConfig4);
	log('Invalid Config 4 (ORM without database):', errors4);
	log('Expected: ["Cannot select an ORM without selecting a database engine"]\n');

	const validErrors = validatePlaygroundConfig(basicConfig);
	log('Valid Config Errors:', validErrors);
	log('Expected: []\n');

	log('All tests complete!');
};

// Run tests when executed directly
runTests();