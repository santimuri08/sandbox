import { isValidProviderOption, providers } from 'citra';
import { eq } from 'drizzle-orm';
import { DatabaseType, NewUser, schema } from '../../../db/schema';
import { UserFunctionProps } from '../../types/types';

type GetDBUser = {
	authSub: string;
	db: DatabaseType;
};

export const getDBUser = async ({ authSub, db }: GetDBUser) => {
	const [user] = await db
		.select()
		.from(schema.users)
		.where(eq(schema.users.auth_sub, authSub))
		.execute();

	return user;
};

export const createDBUser = async ({
	auth_sub,
	db,
	metadata
}: NewUser & { db: DatabaseType }) => {
	const [newUser] = await db
		.insert(schema.users)
		.values({
			auth_sub,
			metadata
		})
		.returning();

	return newUser;
};

export const createUser = ({
	userIdentity,
	authProvider,
	db
}: UserFunctionProps) => {
	if (!isValidProviderOption(authProvider)) {
		throw new Error(`Invalid auth provider: ${authProvider}`);
	}

	const provider = authProvider.toUpperCase();
	const providerConfiguration = providers[authProvider];

	const subject =
		providerConfiguration.extractSubjectFromIdentity(userIdentity);
	const authSub = `${provider}|${subject}`;

	return createDBUser({
		auth_sub: authSub,
		db,
		metadata: userIdentity
	});
};

export const getUser = ({
	userIdentity,
	authProvider,
	db
}: UserFunctionProps) => {
	if (!isValidProviderOption(authProvider)) {
		throw new Error(`Invalid auth provider: ${authProvider}`);
	}

	const provider = authProvider.toUpperCase();
	const providerConfiguration = providers[authProvider];

	const subject =
		providerConfiguration.extractSubjectFromIdentity(userIdentity);
	const authSub = `${provider}|${subject}`;

	return getDBUser({ authSub, db });
};
