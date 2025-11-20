#!/usr/bin/env bun
import readline from 'readline';
import {
	providerOptions,
	isValidProviderOption,
	type ProviderOption
} from '@absolutejs/auth';
import { PROVIDER_STATUSES } from '../../src/constants';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { schema, type Provider } from '../../db/schema';
import { updateProviderStatus } from '../../src/backend/handlers/providerHandlers';
import { env } from 'process';

if (!env.DATABASE_URL) {
	console.error('DATABASE_URL not set');
	process.exit(1);
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

const validProviders = providerOptions;
const validActions = ['authorization', 'refresh', 'revoke', 'profile'] as const;
type Action = (typeof validActions)[number];
const validNewStatuses = PROVIDER_STATUSES;

// 1) Select provider
let provider: ProviderOption;
while (true) {
	const input = await ask(
		'Which provider do you want to update? (leave blank to choose) '
	);
	if (input === '') {
		validProviders.forEach((p, i) => console.log(`${i + 1}) ${p}`));
		const num = Number(
			await ask(`Enter choice [1-${validProviders.length}]: `)
		);
		if (num >= 1 && num <= validProviders.length) {
			const candidate = validProviders[num - 1];
			if (candidate !== undefined) {
				provider = candidate;
				break;
			}
		}
	} else if (isValidProviderOption(input)) {
		provider = input;
		break;
	}
	console.log('Invalid provider.');
}

// 2) Select one or more actions (status types)
let actions: Action[];
while (true) {
	validActions.forEach((s, i) => console.log(`${i + 1}) ${s}`));
	const input = await ask(
		`Select status types to update [1-${validActions.length}, comma-separated]: `
	);
	const indices = input
		.split(',')
		.map((s) => Number(s.trim()))
		.filter((n) => !Number.isNaN(n) && n >= 1 && n <= validActions.length);

	if (indices.length > 0) {
		// Map indices to actions and filter out any undefined just in case
		actions = indices
			.map((n) => validActions[n - 1])
			.filter((a): a is Action => a !== undefined);
		if (actions.length > 0) {
			break;
		}
	}
	console.log('Invalid choice.');
}

// 3) Map each action to the corresponding column name
const columns: Array<
	keyof Pick<
		Provider,
		| 'authorize_status'
		| 'profile_status'
		| 'refresh_status'
		| 'revoke_status'
	>
> = actions.map((action) => {
	switch (action) {
		case 'authorization':
			return 'authorize_status';
		case 'refresh':
			return 'refresh_status';
		case 'revoke':
			return 'revoke_status';
		case 'profile':
			return 'profile_status';
	}
});

// 4) For each selected column, ask for a new status and update
for (const column of columns) {
	let newStatus: Provider['authorize_status'];
	while (true) {
		validNewStatuses.forEach((s, i) => console.log(`${i + 1}) ${s}`));
		const num = Number(
			await ask(
				`Select new status for "${column}" [1-${validNewStatuses.length}]: `
			)
		);
		if (num >= 1 && num <= validNewStatuses.length) {
			const candidate = validNewStatuses[num - 1];
			if (candidate !== undefined) {
				newStatus = candidate;
				break;
			}
		}
		console.log('Invalid choice.');
	}

	const updated = await updateProviderStatus({
		db,
		name: provider,
		column,
		status: newStatus
	});

	console.log(
		`✓ Provider "${provider}" — set ${column} → "${newStatus}".`,
		updated
	);
}

rl.close();
