import { DatabaseType, schema } from '../../../db/schema';

type LogErrorProps = {
	db: DatabaseType;
	message: string;
	stack: string;
};

type LogUnknownErrorProps = {
	db: DatabaseType;
	raw: unknown;
};

type HandleErrorLoggingProps = {
	error: unknown;
	db: DatabaseType;
	authProvider: string;
};

export const logError = async ({ db, message, stack }: LogErrorProps) => {
	const [errorLog] = await db
		.insert(schema.errorLogs)
		.values({
			message,
			stack
		})
		.returning();

	return errorLog;
};

export const logUnknownError = async ({ db, raw }: LogUnknownErrorProps) => {
	const [unknownErrorLog] = await db
		.insert(schema.unknownErrorLogs)
		.values({
			raw
		})
		.returning();

	return unknownErrorLog;
};

export const handleErrorLogging = async ({
	error,
	db,
	authProvider
}: HandleErrorLoggingProps) => {
	if (error instanceof Error) {
		logError({
			db,
			message: error.message,
			stack: error.stack ?? 'No stack trace available'
		})
			.then(() => {
				console.log(`Error logged for provider ${authProvider}`);

				return null;
			})
			.catch((e) => {
				console.error(
					`Failed to log error for provider ${authProvider}:`,
					e
				);
			});
	} else {
		logUnknownError({
			db,
			raw: error
		})
			.then(() => {
				console.log(
					`Unknown error logged for provider ${authProvider}`
				);

				return null;
			})
			.catch((e) => {
				console.error(
					`Failed to log unknown error for provider ${authProvider}:`,
					e
				);
			});
	}
};
