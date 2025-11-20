import {
	asset,
	build,
	handleReactPageRequest,
	networking
} from '@absolutejs/absolute';
import { absoluteAuth } from '@absolutejs/auth';
import { staticPlugin } from '@elysiajs/static';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { Elysia, env, t } from 'elysia';
import { schema, User } from '../../db/schema';
import { AuthTesting } from '../frontend/pages/AuthTesting';
import { Documentation } from '../frontend/pages/Documentation';
import { Home } from '../frontend/pages/Home';
import { docsViewEnum, themeCookie } from '../types/typebox';
import { providerPlugin } from './plugins/providerPlugin';
import { absoluteAuthConfig } from './utils/absoluteAuthConfig';
import { Playground } from '../frontend/pages/Playground';


const manifest = await build({
	assetsDirectory: 'src/backend/assets',
	reactDirectory: 'src/frontend'
});

if (env.DATABASE_URL === undefined) {
	throw new Error('DATABASE_URL is not set in .env file');
}

const sql = neon(env.DATABASE_URL);
const db = drizzle(sql, {
	schema
});

const server = new Elysia()
	.use(
		staticPlugin({
			assets: './build',
			prefix: ''
		})
	)
	.use(providerPlugin(db))
	.use(absoluteAuth<User>(absoluteAuthConfig(db)))
	.get(
		'/',
		({ cookie: { theme } }) =>
			handleReactPageRequest(Home, asset(manifest, 'HomeIndex'), {
				theme: theme?.value
			}),
		{ cookie: themeCookie }
	)
	.get(
		'/documentation/:view?',
		({ params: { view }, cookie: { theme } }) =>
			handleReactPageRequest(
				Documentation,
				asset(manifest, 'DocumentationIndex'),
				{
					initialView: view ?? 'overview',
					theme: theme?.value
				}
			),
		{
			cookie: themeCookie,
			params: t.Object({ view: t.Optional(docsViewEnum) })
		}
	)
	.get(
		'/testing/authentication',
		({ cookie: { theme } }) =>
			handleReactPageRequest(
				AuthTesting,
				asset(manifest, 'AuthTestingIndex'),
				{
					theme: theme?.value
				}
			),
		{ cookie: themeCookie }
	)
		.get(
		'/playground',
		({ cookie: { theme } }) =>
			handleReactPageRequest(
				Playground,
				asset(manifest, 'PlaygroundIndex'),
				{
					theme: theme?.value
				}
			),
		{ cookie: themeCookie }
	)

	.use(networking)
	.on('error', (error) => {
		const { request } = error;
		console.error(
			`Server error on ${request.method} ${request.url}: ${error.message}`
		);
	});

export type Server = typeof server;

// TODO : avoid using localhost as per RFC 8252 8.3 https://datatracker.ietf.org/doc/html/rfc8252#section-8.3
