import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from 'process';
import { schema } from '../schema';
import { getProvidersByStatus } from '../../src/backend/handlers/providerHandlers';
import readline from 'readline';
import { PROVIDER_STATUSES } from '../../src/constants';

if (!env.DATABASE_URL) {
	throw new Error('Please set DATABASE_URL in your .env file');
}

const sql = neon(env.DATABASE_URL);
const db = drizzle(sql, { schema });

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
const ask = (q: string) =>
	new Promise<string>((resolve) =>
		rl.question(q, (answer) => resolve(answer.trim()))
	);

const validStatuses = PROVIDER_STATUSES;
type Status = (typeof validStatuses)[number];

let status: Status | undefined;
let index: number;

do {
	validStatuses.forEach((s, i) => console.log(`${i + 1}) ${s}`));
	index =
		Number(await ask(`Select status type [1-${validStatuses.length}]: `)) -
		1;

	if (index >= 0 && index < validStatuses.length) {
		status = validStatuses[index];
	} else {
		console.log('Invalid status.');
	}
} while (!status);

const providers = await getProvidersByStatus(db, status);

if (providers.length === 0) {
	console.log(`No providers found with status "${status}".`);
} else {
	console.log(`Providers with status "${status}":`);
	const operations = ['authorize', 'profile', 'refresh', 'revoke'] as const;

	providers.forEach((provider) => {
		const matchingOps = operations.filter((op) => provider[op] === status);

		if (matchingOps.length === 0) {
			console.log(
				`- ${provider.name} (no operations with status "${status}")`
			);
		} else {
			console.log(`- ${provider.name}:`);
			matchingOps.forEach((op) => {
				console.log(`    • ${op} (${status})`);
			});
		}
	});
}

rl.close();
