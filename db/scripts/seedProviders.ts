import { providerOptions } from '@absolutejs/auth';
import { createProvider } from '../../src/backend/handlers/providerHandlers';
import { schema } from '../schema';
import { env } from 'process';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!env.DATABASE_URL) {
	throw new Error('Please set DATABASE_URL in your .env file');
}

const sql = neon(env.DATABASE_URL);
const db = drizzle(sql, { schema });

const existingProviders = await db.select().from(schema.providers).execute();
const existingProviderNames = new Set(
	existingProviders.map((record) => record.name)
);
const providersToCreate = providerOptions.filter(
	(name) => !existingProviderNames.has(name)
);

if (providersToCreate.length === 0) {
	console.log('All providers are already created. Nothing to do.');
	process.exit(0);
}

const creationPromises = providersToCreate.map((name) =>
	createProvider({ db, name })
);
const creationResults = await Promise.allSettled(creationPromises);

for (const [index, result] of creationResults.entries()) {
	const providerName = providersToCreate[index];
	if (result.status === 'fulfilled') {
		console.log(`✅ Provider added: ${providerName}`);
	} else {
		console.error(
			`🚫 Could not add provider ${providerName}:`,
			result.reason
		);
	}
}
