import { isValidProviderOption, ProviderOption } from '@absolutejs/auth';
import { eq, or } from 'drizzle-orm';
import { DatabaseType, Provider, schema } from '../../../db/schema';
import { PROVIDER_STATUSES } from '../../constants';
import { handleErrorLogging } from './errorLogHandlers';

type ProviderFunctionProps = {
	db: DatabaseType;
	name: ProviderOption;
};

type HandleStatusUpdateProps = {
	column: Extract<
		keyof Provider,
		| 'authorize_status'
		| 'profile_status'
		| 'refresh_status'
		| 'revoke_status'
	>;

	db: DatabaseType;
	guardStatuses: (typeof PROVIDER_STATUSES)[number][];
	newStatus: Extract<(typeof PROVIDER_STATUSES)[number], 'tested' | 'failed'>;
	authProvider: string;
	error?: Error | unknown;
};

export const createProvider = async ({ db, name }: ProviderFunctionProps) => {
	const [provider] = await db
		.insert(schema.providers)
		.values({
			name
		})
		.returning();

	return provider;
};

export const getProvider = async ({ db, name }: ProviderFunctionProps) => {
	const [provider] = await db
		.select()
		.from(schema.providers)
		.where(eq(schema.providers.name, name))
		.execute();

	return provider;
};

export const updateProviderStatus = async ({
	db,
	name,
	column,
	status
}: ProviderFunctionProps & {
	column: Extract<
		keyof Provider,
		| 'authorize_status'
		| 'profile_status'
		| 'refresh_status'
		| 'revoke_status'
	>;
	status: (typeof PROVIDER_STATUSES)[number];
}) => {
	const [updatedProvider] = await db
		.update(schema.providers)
		.set({ [column]: status })
		.where(eq(schema.providers.name, name))
		.returning()
		.execute();

	return updatedProvider;
};

export const resetAllProviderStatuses = async (db: DatabaseType) => {
	await db.update(schema.providers).set({
		authorize_status: 'untested',
		profile_status: 'untested',
		refresh_status: 'untested',
		revoke_status: 'untested'
	});
};

export const getProvidersByStatus = async (
	db: DatabaseType,
	status: (typeof PROVIDER_STATUSES)[number]
) => {
	const providers = await db
		.select({
			authorize: schema.providers.authorize_status,
			name: schema.providers.name,
			profile: schema.providers.profile_status,
			refresh: schema.providers.refresh_status,
			revoke: schema.providers.revoke_status
		})
		.from(schema.providers)
		.where(
			or(
				eq(schema.providers.authorize_status, status),
				eq(schema.providers.profile_status, status),
				eq(schema.providers.refresh_status, status),
				eq(schema.providers.revoke_status, status)
			)
		);

	return providers;
};

export const handleStatusUpdate = async ({
	db,
	column,
	guardStatuses,
	newStatus,
	authProvider,
	error
}: HandleStatusUpdateProps) => {
	if (!isValidProviderOption(authProvider)) {
		throw new Error(`Invalid auth provider: ${authProvider}`);
	}

	const [{ [column]: currentStatus } = {}] = await db
		.select({ [column]: schema.providers[column] })
		.from(schema.providers)
		.where(eq(schema.providers.name, authProvider))
		.execute();

	if (currentStatus === undefined || !guardStatuses.includes(currentStatus)) {
		return;
	}

	await updateProviderStatus({
		column,
		db,
		name: authProvider,
		status: newStatus
	})
		.then(() => {
			console.log(
				`Provider ${authProvider} ${column} status updated to '${newStatus}'`
			);

			return null;
		})
		.catch((err) => {
			console.error(
				`Failed to update provider ${authProvider} ${column} status:`,
				err
			);
		});

	if (error !== undefined) {
		handleErrorLogging({
			authProvider,
			db,
			error
		});
	}
};
