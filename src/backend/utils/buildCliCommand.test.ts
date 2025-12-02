import { buildCliCommand, validatePlaygroundConfig, type PlaygroundConfig } from './buildCliCommand';
console.log('Testing CLI Command Builder...\n');
const basicConfig: PlaygroundConfig = {
	projectName: 'my-app',
	configurationType: 'default',
	frontends: ['react'],
	databaseEngine: 'postgresql',
	databaseHost: 'neon',
	orm: 'drizzle',
	authProvider: 'absoluteAuth',
	codeQualityTool: 'eslint+prettier',
	useTailwind: true,
	useHtmlScripts: false,
	selectedPlugins: ['@elysiajs/cors'],
	gitInit: false,
	installDeps: false
};
console.log('Test 1: Basic Configuration');
console.log('Config:', JSON.stringify(basicConfig, null, 2));
const command1 = buildCliCommand(basicConfig);
console.log('Generated Command:', command1);
console.log('Expected: bun create absolutejs my-app --eslint+prettier --react --tailwind --db postgresql --db-host neon --orm drizzle --auth absoluteAuth --plugin @elysiajs/cors\n');
const multiConfig: PlaygroundConfig = {
	projectName: 'multi-framework-app',
	configurationType: 'custom',
	frontends: ['react', 'htmx', 'vue'],
	databaseEngine: 'none',
	databaseHost: undefined,
	orm: undefined,
	authProvider: 'none',
	codeQualityTool: 'biome',
	useTailwind: false,
	useHtmlScripts: true,
	selectedPlugins: [],
	gitInit: true,
	installDeps: false
};
console.log('Test 2: Multiple Frontends, No Database, With Git');
console.log('Config:', JSON.stringify(multiConfig, null, 2));
const command2 = buildCliCommand(multiConfig);
console.log('Generated Command:', command2);
console.log('Expected: bun create absolutejs multi-framework-app --biome --react --htmx --vue --html-scripts --directory custom --git\n');
const sqliteConfig: PlaygroundConfig = {
	projectName: 'sqlite-app',
	configurationType: 'default',
	frontends: ['svelte'],
	databaseEngine: 'sqlite',
	databaseHost: 'turso',
	orm: 'drizzle',
	authProvider: 'absoluteAuth',
	codeQualityTool: 'eslint+prettier',
	useTailwind: true,
	useHtmlScripts: false,
	selectedPlugins: ['@elysiajs/swagger', 'elysia-rate-limit'],
	gitInit: true,
	installDeps: true
};
console.log('Test 3: SQLite with Turso, Git and Install');
console.log('Config:', JSON.stringify(sqliteConfig, null, 2));
const command3 = buildCliCommand(sqliteConfig);
console.log('Generated Command:', command3);
console.log('Expected: bun create absolutejs sqlite-app --eslint+prettier --svelte --tailwind --db sqlite --db-host turso --orm drizzle --auth absoluteAuth --plugin @elysiajs/swagger --plugin elysia-rate-limit --git --install\n');
console.log('Test 4: Validation Tests');
const invalidConfig1: PlaygroundConfig = {
	projectName: '',
	configurationType: 'default',
	frontends: ['react'],
	databaseEngine: 'none',
	databaseHost: undefined,
	orm: undefined,
	authProvider: 'none',
	codeQualityTool: 'eslint+prettier',
	useTailwind: false,
	useHtmlScripts: false,
	selectedPlugins: [],
	gitInit: false,
	installDeps: false
};
const errors1 = validatePlaygroundConfig(invalidConfig1);
console.log('Invalid Config 1 (empty name):', errors1);
console.log('Expected: ["Project name is required"]\n');
const invalidConfig2: PlaygroundConfig = {
	projectName: 'my app!',
	configurationType: 'default',
	frontends: ['react'],
	databaseEngine: 'none',
	databaseHost: undefined,
	orm: undefined,
	authProvider: 'none',
	codeQualityTool: 'eslint+prettier',
	useTailwind: false,
	useHtmlScripts: false,
	selectedPlugins: [],
	gitInit: false,
	installDeps: false
};
const errors2 = validatePlaygroundConfig(invalidConfig2);
console.log('Invalid Config 2 (invalid characters):', errors2);
console.log('Expected: ["Project name can only contain letters, numbers, dashes, and underscores"]\n');
const invalidConfig3: PlaygroundConfig = {
	projectName: 'my-app',
	configurationType: 'default',
	frontends: [],
	databaseEngine: 'none',
	databaseHost: undefined,
	orm: undefined,
	authProvider: 'none',
	codeQualityTool: 'eslint+prettier',
	useTailwind: false,
	useHtmlScripts: false,
	selectedPlugins: [],
	gitInit: false,
	installDeps: false
};
const errors3 = validatePlaygroundConfig(invalidConfig3);
console.log('Invalid Config 3 (no frontends):', errors3);
console.log('Expected: ["At least one frontend framework must be selected"]\n');
const invalidConfig4: PlaygroundConfig = {
	projectName: 'my-app',
	configurationType: 'default',
	frontends: ['react'],
	databaseEngine: 'none',
	databaseHost: undefined,
	orm: 'drizzle',
	authProvider: 'none',
	codeQualityTool: 'eslint+prettier',
	useTailwind: false,
	useHtmlScripts: false,
	selectedPlugins: [],
	gitInit: false,
	installDeps: false
};
const errors4 = validatePlaygroundConfig(invalidConfig4);
console.log('Invalid Config 4 (ORM without database):', errors4);
console.log('Expected: ["Cannot select an ORM without selecting a database engine"]\n');
const validErrors = validatePlaygroundConfig(basicConfig);
console.log('Valid Config Errors:', validErrors);
console.log('Expected: []\n');
console.log('All tests complete!');