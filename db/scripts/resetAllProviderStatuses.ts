#!/usr/bin/env bun
import { neon } from '@neondatabase/serverless';
import { env } from 'process';
import { drizzle } from 'drizzle-orm/neon-http';
import { schema } from '../schema';
import { resetAllProviderStatuses } from '../../src/backend/handlers/providerHandlers';

if (!env.DATABASE_URL) {
	throw new Error('Please set DATABASE_URL in your .env file');
}

const sql = neon(env.DATABASE_URL);
const db = drizzle(sql, { schema });

await resetAllProviderStatuses(db);
console.log('✅ All provider statuses have been reset to "untested".');
process.exit(0);
