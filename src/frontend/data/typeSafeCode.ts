export const databaseCode = `import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { pgTable, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    auth_sub: varchar('auth_sub', { length: 255 }).primaryKey(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().default({})
});

export const schema = {
	users,
};

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type SchemaType = typeof schema;
export type DatabaseType = NeonHttpDatabase<SchemaType>;`;

export const backendCode = `import { build, getEnvVar, handleReactPageRequest, networkingPlugin } from '@absolutejs/absolute';
import { Home } from '../frontend/pages/Home';
import { Elysia, env } from 'elysia';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { schema, User } from '../../db/schema';

const manifest = await build({
    reactDirectory: 'src/frontend'
});

if (manifest === null || manifest['HomeIndex'] === undefined) {
	throw new Error('Failed to build manifest');
}

const sql = neon(getEnvVar('DATABASE_URL'))
const db = drizzle(sql, { schema });

const server = new Elysia()
    .get('/', () => handleReactPageRequest(Home, manifest['HomeIndex']))
    .get('/api/users/:subject', 
    async ({ status, params: { subject } }) => {
        try {
            const [user] = db.select().from(schema.users).where(schema.users.auth_sub.eq(subject))
            return user === undefined ? status(404, 'User not found') : user;
        } catch ( error ) {
            return status(500, 'Internal Server Error while fetching user');
        }
    }

export type Server = typeof server;`;

export const treatyCode = `import { treaty } from '@elysiajs/eden';
import type { Server } from '../../backend/server';

const serverUrl =
	typeof window !== 'undefined'
		? window.location.origin
		: 'http://localhost:3000';

export const server = treaty<Server>(serverUrl);`;

export const frontendCode = `import { server } from '../eden/treaty';
import { Head } from '../components/page/Head';
import { bodyDefault, htmlDefault, mainDefault } from '../styles';

export const Home = () => {
    const { data, error } = await server.api.users({subject:"EXAMPLE|12345"}).get();

    if( error !== null ) return (error);

    return (
        <html lang="en" style={htmlDefault}>
            <Head />
            <body style={bodyDefault}>
                <main style={mainDefault}>
                    <h1>{data.auth_sub}</h1>
                    <p>Created at: {data.created_at}</p>
                </main>
            </body>
        </html>
    );
};`;
