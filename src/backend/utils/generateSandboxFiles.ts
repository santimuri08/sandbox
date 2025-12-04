import type { PlaygroundConfig } from './buildCliCommand';

export interface SandboxFiles {
	[path: string]: { content: string };
}

const generatePackageJson = (config: PlaygroundConfig) => {
	const deps: Record<string, string> = { elysia: '^1.2.0' };

	if (config.selectedPlugins.includes('@elysiajs/cors')) deps['@elysiajs/cors'] = '^1.2.0';
	if (config.selectedPlugins.includes('@elysiajs/swagger')) deps['@elysiajs/swagger'] = '^1.2.0';
	if (config.frontends.includes('react')) {
		deps['react'] = '^18.2.0';
		deps['react-dom'] = '^18.2.0';
	}
	if (config.orm === 'drizzle') deps['drizzle-orm'] = '^0.30.0';
	if (config.orm === 'prisma') deps['@prisma/client'] = '^5.0.0';

	return JSON.stringify({
		dependencies: deps, devDependencies: { '@types/bun': 'latest', typescript: '^5.0.0' }, name: config.projectName, scripts: {
			'bun:dev': 'bun run --hot src/backend/server.ts', dev: 'node server.js', start: 'node server.js'
		}, type: 'module', version: '0.0.1'
	}, null, 2);
};

const getThemeColors = (frontends: string[]) => {
	if (frontends.includes('react')) return { primary: '#61dafb', secondary: '#282c34' };
	if (frontends.includes('vue')) return { primary: '#42b883', secondary: '#35495e' };
	if (frontends.includes('svelte')) return { primary: '#ff3e00', secondary: '#40b3ff' };

	return { primary: '#667eea', secondary: '#764ba2' };
};

const generateServerFile = (config: PlaygroundConfig) => {
	const { primary, secondary } = getThemeColors(config.frontends);

	const features = [
		...config.frontends,
		config.databaseEngine !== 'none' ? config.databaseEngine : null,
		config.orm,
		config.authProvider !== 'none' ? 'Auth' : null,
		config.useTailwind ? 'Tailwind' : null
	].filter(Boolean);

	const techBadges = features.map((feat) => `<span class="tech-badge">${feat}</span>`).join('\n\t\t');

	const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${config.projectName}</title>
	<style>
		* { margin: 0; padding: 0; box-sizing: border-box; }
		body { font-family: system-ui, sans-serif; background: linear-gradient(135deg, ${secondary} 0%, ${primary}22 100%); min-height: 100vh; color: #fff; }
		.hero { text-align: center; padding: 4rem 2rem; }
		.hero h1 { font-size: 3rem; margin-bottom: 1rem; background: linear-gradient(90deg, ${primary}, #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
		.btn { display: inline-block; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; margin-top: 1rem; }
		.btn-primary { background: ${primary}; color: ${secondary}; }
		.counter { margin-top: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.1); border-radius: 1rem; display: inline-block; }
		.counter-value { font-size: 3rem; font-weight: bold; margin-bottom: 1rem; }
		.counter-btn { width: 3rem; height: 3rem; border: none; border-radius: 0.5rem; font-size: 1.5rem; cursor: pointer; margin: 0 0.25rem; }
		.features { padding: 3rem 2rem; text-align: center; }
		.features h2 { margin-bottom: 2rem; }
		.features-grid { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
		.feature-card { background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 0.5rem; min-width: 150px; }
		.tech-badges { display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap; padding: 2rem; }
		.tech-badge { background: ${primary}33; padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.875rem; border: 1px solid ${primary}66; }
		footer { text-align: center; padding: 2rem; opacity: 0.7; }
		footer a { color: ${primary}; }
	</style>
</head>
<body>
	<section class="hero">
		<h1>${config.projectName} 🚀</h1>
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

	<footer>Built with <a href="https://absolutejs.com">AbsoluteJS</a></footer>

	<script>
		let n = 0;
		function c(d) {
			n += d;
			document.getElementById('count').textContent = n;
		}
	</script>
</body>
</html>`;

	return `import http from 'http';

const PORT = 3000;

const html = \`${html}\`;

http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(html);
}).listen(PORT, () => console.log('http://localhost:' + PORT));
`;
};

const generateElysiaServer = (config: PlaygroundConfig) => {
	const imports = ["import { Elysia } from 'elysia';"];
	const uses: string[] = [];

	if (config.selectedPlugins.includes('@elysiajs/cors')) {
		imports.push("import { cors } from '@elysiajs/cors';");
		uses.push('.use(cors())');
	}
	if (config.selectedPlugins.includes('@elysiajs/swagger')) {
		imports.push("import { swagger } from '@elysiajs/swagger';");
		uses.push('.use(swagger())');
	}

	return `${imports.join('\n')}

const app = new Elysia()
  ${uses.join('\n  ')}
  .get('/', () => 'Welcome to ${config.projectName}!')
  .get('/api/health', () => ({ status: 'ok' }))
  .listen(3000);

console.log('🦊 Running at http://localhost:3000');`;
};

const generateReadme = (config: PlaygroundConfig) => {
	const ormInfo = config.orm ? ` (${config.orm})` : '';
	const tailwindLine = config.useTailwind ? '- Tailwind CSS\n' : '';

	return `# ${config.projectName}

> Generated with [AbsoluteJS](https://absolutejs.com)

## Config
- Frontends: ${config.frontends.join(', ')}
- Database: ${config.databaseEngine}${ormInfo}
- Auth: ${config.authProvider}
${tailwindLine}
## Run
\`\`\`bash
bun install && bun run dev
\`\`\``;
};

const generateEnvExample = (config: PlaygroundConfig) => {
	let env = 'PORT=3000\n';
	if (config.databaseEngine === 'postgresql') env += 'DATABASE_URL=postgresql://user:pass@localhost:5432/db\n';
	if (config.databaseEngine === 'sqlite') env += 'DATABASE_URL=file:./local.db\n';
	if (config.authProvider !== 'none') env += 'JWT_SECRET=your-secret\n';

	return env;
};

const generateDrizzleSchema = (config: PlaygroundConfig) => {
	if (config.databaseEngine === 'postgresql') {
		return `import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});`;
	}

	return `import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull()
});`;
};

const generatePrismaSchema = (config: PlaygroundConfig) => {
	const provider = config.databaseEngine === 'postgresql' ? 'postgresql' : 'sqlite';

	return `generator client { provider = "prisma-client-js" }

datasource db {
  provider = "${provider}"
  url = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}`;
};

const addReactFiles = (files: SandboxFiles, projectName: string) => {
	files['src/frontend/pages/Home.tsx'] = {
		content: `import { useState } from 'react';

export function Home() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome to ${projectName}! 🚀</h1>
      <p>Built with AbsoluteJS</p>
      <div style={{ marginTop: '2rem' }}>
        <span style={{ fontSize: '2rem' }}>{count}</span>
        <div>
          <button onClick={() => setCount(c => c - 1)}>-</button>
          <button onClick={() => setCount(c => c + 1)}>+</button>
        </div>
      </div>
    </div>
  );
}`
	};
};

const addFrontendFiles = (files: SandboxFiles, config: PlaygroundConfig) => {
	if (config.frontends.includes('react')) addReactFiles(files, config.projectName);
	if (config.frontends.includes('vue')) {
		files['src/frontend/pages/Home.vue'] = { content: `<template><h1>Welcome to ${config.projectName}!</h1></template>` };
	}
	if (config.frontends.includes('svelte')) {
		files['src/frontend/pages/Home.svelte'] = { content: `<h1>Welcome to ${config.projectName}!</h1>` };
	}
	if (config.frontends.includes('html')) {
		files['src/frontend/pages/index.html'] = { content: `<!DOCTYPE html><html><head><title>${config.projectName}</title></head><body><h1>Welcome!</h1></body></html>` };
	}
};

const addDatabaseFiles = (files: SandboxFiles, config: PlaygroundConfig) => {
	if (config.databaseEngine === 'none') return;
	
	if (config.orm === 'drizzle') {
		files['src/db/schema.ts'] = { content: generateDrizzleSchema(config) };
	}
	if (config.orm === 'prisma') {
		files['prisma/schema.prisma'] = { content: generatePrismaSchema(config) };
	}
};

const addOptionalFiles = (files: SandboxFiles, config: PlaygroundConfig) => {
	if (config.authProvider !== 'none') {
		files['src/auth/index.ts'] = {
			content: `import { Elysia } from 'elysia';

export const auth = new Elysia({ prefix: '/auth' })
  .post('/login', () => ({ success: true }))
  .post('/register', () => ({ success: true }));`
		};
	}
	if (config.useTailwind) {
		files['tailwind.config.js'] = { content: `export default { content: ['./src/**/*.{js,jsx,ts,tsx}'], theme: { extend: {} }, plugins: [] }` };
	}
	if (config.codeQualityTool === 'biome') {
		files['biome.json'] = { content: '{ "linter": { "enabled": true } }' };
	}
};

export const generateSandboxFiles = (config: PlaygroundConfig) => {
	const files: SandboxFiles = {
		'.env.example': { content: generateEnvExample(config) }, 'package.json': { content: generatePackageJson(config) }, 'README.md': { content: generateReadme(config) }, 'server.js': { content: generateServerFile(config) }, 'src/backend/server.ts': { content: generateElysiaServer(config) }, 'tsconfig.json': { content: '{ "compilerOptions": { "target": "ES2022", "module": "ESNext", "jsx": "react-jsx", "strict": true, "types": ["bun-types"] } }' }
	};

	addFrontendFiles(files, config);
	addDatabaseFiles(files, config);
	addOptionalFiles(files, config);

	return files;
};