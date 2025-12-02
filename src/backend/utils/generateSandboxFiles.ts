import type { PlaygroundConfig } from './buildCliCommand';
export interface SandboxFiles {
	[path: string]: { content: string };
}
export function generateSandboxFiles(config: PlaygroundConfig): SandboxFiles {
	const files: SandboxFiles = {};
	files['package.json'] = { content: generatePackageJson(config) };
	files['server.js'] = { content: generateServerFile(config) };
	files['README.md'] = { content: generateReadme(config) };
	files['src/backend/server.ts'] = { content: generateElysiaServer(config) };
	files['tsconfig.json'] = { content: '{ "compilerOptions": { "target": "ES2022", "module": "ESNext", "jsx": "react-jsx", "strict": true, "types": ["bun-types"] } }' };
	files['.env.example'] = { content: generateEnv(config) };
	if (config.frontends.includes('react')) {
		files['src/frontend/pages/Home.tsx'] = { content: generateReactPage(config) };
	}
	if (config.frontends.includes('vue')) {
		files['src/frontend/pages/Home.vue'] = { content: `<template><h1>Welcome to ${config.projectName}!</h1></template>` };
	}
	if (config.frontends.includes('svelte')) {
		files['src/frontend/pages/Home.svelte'] = { content: `<h1>Welcome to ${config.projectName}!</h1>` };
	}
	if (config.frontends.includes('html')) {
		files['src/frontend/pages/index.html'] = { content: `<!DOCTYPE html><html><head><title>${config.projectName}</title></head><body><h1>Welcome!</h1></body></html>` };
	}
	if (config.databaseEngine !== 'none' && config.orm === 'drizzle') {
		files['src/db/schema.ts'] = { content: generateDrizzleSchema(config) };
	}
	if (config.databaseEngine !== 'none' && config.orm === 'prisma') {
		files['prisma/schema.prisma'] = { content: generatePrismaSchema(config) };
	}
	if (config.authProvider !== 'none') {
		files['src/auth/index.ts'] = { content: `import { Elysia } from 'elysia';\nexport const auth = new Elysia({ prefix: '/auth' })\n  .post('/login', () => ({ success: true }))\n  .post('/register', () => ({ success: true }));` };
	}
	if (config.useTailwind) {
		files['tailwind.config.js'] = { content: `export default { content: ['./src/**/*.{js,jsx,ts,tsx}'], theme: { extend: {} }, plugins: [] }` };
	}
	if (config.codeQualityTool === 'biome') {
		files['biome.json'] = { content: '{ "linter": { "enabled": true } }' };
	}
	return files;
}
function generatePackageJson(config: PlaygroundConfig): string {
	const deps: Record<string, string> = { elysia: '^1.2.0' };
	if (config.selectedPlugins.includes('@elysiajs/cors')) deps['@elysiajs/cors'] = '^1.2.0';
	if (config.selectedPlugins.includes('@elysiajs/swagger')) deps['@elysiajs/swagger'] = '^1.2.0';
	if (config.frontends.includes('react')) { deps['react'] = '^18.2.0'; deps['react-dom'] = '^18.2.0'; }
	if (config.orm === 'drizzle') deps['drizzle-orm'] = '^0.30.0';
	if (config.orm === 'prisma') deps['@prisma/client'] = '^5.0.0';
	return JSON.stringify({
		name: config.projectName,
		version: '0.0.1',
		type: 'module',
		scripts: { dev: 'node server.js', start: 'node server.js', 'bun:dev': 'bun run --hot src/backend/server.ts' },
		dependencies: deps,
		devDependencies: { '@types/bun': 'latest', typescript: '^5.0.0' }
	}, null, 2);
}
function generateServerFile(config: PlaygroundConfig): string {
	const getTheme = () => {
		if (config.frontends.includes('react')) return { primary: '#61dafb', secondary: '#282c34' };
		if (config.frontends.includes('vue')) return { primary: '#42b883', secondary: '#35495e' };
		if (config.frontends.includes('svelte')) return { primary: '#ff3e00', secondary: '#40b3ff' };
		return { primary: '#667eea', secondary: '#764ba2' };
	};
	const { primary, secondary } = getTheme();
	const features = [
		...config.frontends,
		config.databaseEngine !== 'none' ? config.databaseEngine : null,
		config.orm || null,
		config.authProvider !== 'none' ? 'Auth' : null,
		config.useTailwind ? 'Tailwind' : null,
		'Bun',
		'Elysia'
	].filter((f): f is string => f !== null);
	const css = `
		* { margin: 0; padding: 0; box-sizing: border-box; }
		body { font-family: system-ui, sans-serif; }
		nav { background: ${secondary}; padding: 1rem 2rem; display: flex; justify-content: space-between; }
		.logo { color: white; font-weight: 700; }
		nav a { color: white; margin-left: 1rem; text-decoration: none; }
		.hero { background: linear-gradient(135deg, ${primary}, ${secondary}); padding: 4rem 2rem; text-align: center; color: white; }
		.hero h1 { font-size: 2.5rem; margin-bottom: 1rem; }
		.btn { padding: .75rem 1.5rem; border-radius: 8px; text-decoration: none; display: inline-block; margin: .5rem; }
		.btn-primary { background: white; color: ${secondary}; }
		.counter { background: white; padding: 2rem; border-radius: 12px; display: inline-block; margin-top: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,.15); }
		.counter-value { font-size: 3rem; font-weight: 700; color: ${secondary}; }
		.counter-btn { width: 44px; height: 44px; border-radius: 8px; border: none; font-size: 1.5rem; cursor: pointer; margin: 0 .25rem; }
		.features { padding: 4rem 2rem; background: #f9fafb; }
		.features h2 { text-align: center; margin-bottom: 2rem; }
		.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; max-width: 800px; margin: 0 auto; }
		.feature-card { background: white; padding: 1.5rem; border-radius: 12px; text-align: center; }
		.tech-badges { display: flex; justify-content: center; gap: .5rem; flex-wrap: wrap; padding: 2rem; }
		.tech-badge { background: ${primary}20; color: ${secondary}; padding: .5rem 1rem; border-radius: 20px; font-size: .85rem; }
		footer { background: ${secondary}; color: white; padding: 2rem; text-align: center; }
		footer a { color: ${primary}; }
	`;
	const techBadges = features.map(f => `<span class="tech-badge">${f}</span>`).join('\n\t\t');
	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${config.projectName}</title>
	<style>${css}</style>
</head>
<body>
	<nav>
		<div class="logo">⚡ ${config.projectName}</div>
		<div>
			<a href="/">Home</a>
			<a href="/api/health">API</a>
		</div>
	</nav>

	<section class="hero">
		<h1>Welcome to ${config.projectName}! 🚀</h1>
		<p>Built with AbsoluteJS — Bun + Elysia</p>
		<a href="https://absolutejs.com" class="btn btn-primary" target="_blank">Get Started</a>
		
		<div class="counter">
			<div class="counter-value" id="count">0</div>
			<div>
				<button class="counter-btn" style="background:#fee2e2;color:#dc2626" onclick="c(-1)">−</button>
				<button class="counter-btn" style="background:#dcfce7;color:#16a34a" onclick="c(1)">+</button>
			</div>
		</div>
	</section>

	<section class="features">
		<h2>Project Features</h2>
		<div class="features-grid">
			<div class="feature-card">⚡ Lightning Fast</div>
			<div class="feature-card">🔒 Type Safe</div>
			<div class="feature-card">🚀 Production Ready</div>
		</div>
	</section>

	<div class="tech-badges">
		${techBadges}
	</div>

	<footer>
		Built with using <a href="https://absolutejs.com">AbsoluteJS</a>
	</footer>

	<script>
		let n = 0;
		function c(d) {
			n += d;
			document.getElementById('count').textContent = n;
		}
	</script>
</body>
</html>
	`.trim();
	return `import http from 'http';

const PORT = 3000;

const html = \`${html}\`;

http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(html);
}).listen(PORT, () => console.log('http://localhost:' + PORT));
`;
}
function generateElysiaServer(config: PlaygroundConfig): string {
	const plugins = config.selectedPlugins;
	const imports = ["import { Elysia } from 'elysia';"];
	const uses: string[] = [];
	if (plugins.includes('@elysiajs/cors')) { imports.push("import { cors } from '@elysiajs/cors';"); uses.push('.use(cors())'); }
	if (plugins.includes('@elysiajs/swagger')) { imports.push("import { swagger } from '@elysiajs/swagger';"); uses.push('.use(swagger())'); }
	return `${imports.join('\n')}\n\nconst app = new Elysia()\n  ${uses.join('\n  ')}\n  .get('/', () => 'Welcome to ${config.projectName}!')\n  .get('/api/health', () => ({ status: 'ok' }))\n  .listen(3000);\n\nconsole.log('🦊 Running at http://localhost:3000');`;
}

function generateReadme(config: PlaygroundConfig): string {
	return `# ${config.projectName}\n\n> Generated with [AbsoluteJS](https://absolutejs.com)\n\n## Config\n- Frontends: ${config.frontends.join(', ')}\n- Database: ${config.databaseEngine}${config.orm ? ` (${config.orm})` : ''}\n- Auth: ${config.authProvider}\n${config.useTailwind ? '- Tailwind CSS\n' : ''}\n## Run\n\`\`\`bash\nbun install && bun run dev\n\`\`\``;
}

function generateEnv(config: PlaygroundConfig): string {
	let env = 'PORT=3000\n';
	if (config.databaseEngine === 'postgresql') env += 'DATABASE_URL=postgresql://user:pass@localhost:5432/db\n';
	if (config.databaseEngine === 'sqlite') env += 'DATABASE_URL=file:./local.db\n';
	if (config.authProvider !== 'none') env += 'JWT_SECRET=your-secret\n';
	return env;
}

function generateReactPage(config: PlaygroundConfig): string {
	return `import { useState } from 'react';\n\nexport function Home() {\n  const [count, setCount] = useState(0);\n  return (\n    <div style={{ textAlign: 'center', padding: '2rem' }}>\n      <h1>Welcome to ${config.projectName}! 🚀</h1>\n      <p>Built with AbsoluteJS</p>\n      <div style={{ marginTop: '2rem' }}>\n        <span style={{ fontSize: '2rem' }}>{count}</span>\n        <div>\n          <button onClick={() => setCount(c => c - 1)}>-</button>\n          <button onClick={() => setCount(c => c + 1)}>+</button>\n        </div>\n      </div>\n    </div>\n  );\n}`;
}

function generateDrizzleSchema(config: PlaygroundConfig): string {
	const isPg = config.databaseEngine === 'postgresql';
	return isPg
		? `import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';\n\nexport const users = pgTable('users', {\n  id: serial('id').primaryKey(),\n  email: text('email').notNull().unique(),\n  name: text('name').notNull(),\n  createdAt: timestamp('created_at').defaultNow()\n});`
		: `import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';\n\nexport const users = sqliteTable('users', {\n  id: integer('id').primaryKey({ autoIncrement: true }),\n  email: text('email').notNull().unique(),\n  name: text('name').notNull()\n});`;
}

function generatePrismaSchema(config: PlaygroundConfig): string {
	return `generator client { provider = "prisma-client-js" }\n\ndatasource db {\n  provider = "${config.databaseEngine === 'postgresql' ? 'postgresql' : 'sqlite'}"\n  url = env("DATABASE_URL")\n}\n\nmodel User {\n  id    Int    @id @default(autoincrement())\n  email String @unique\n  name  String\n}`;
}