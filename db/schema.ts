import {
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar
} from 'drizzle-orm/pg-core';
import { PROVIDER_STATUSES } from '../src/constants';
import { ProviderOption } from '@absolutejs/auth';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export const providerStatusEnum = pgEnum('provider_status', PROVIDER_STATUSES);

export const users = pgTable('users', {
	auth_sub: varchar({ length: 255 }).primaryKey(),
	created_at: timestamp().notNull().defaultNow(),
	metadata: jsonb().$type<Record<string, unknown>>().default({})
});

export const providers = pgTable('providers', {
	name: varchar('name', { length: 255 }).primaryKey().$type<ProviderOption>(),
	authorize_status: providerStatusEnum().notNull().default('untested'),
	profile_status: providerStatusEnum().notNull().default('untested'),
	refresh_status: providerStatusEnum().notNull().default('untested'),
	revoke_status: providerStatusEnum().notNull().default('untested')
});

export const errorLogs = pgTable('error_logs', {
	message: text().notNull(),
	timestamp: timestamp().notNull().defaultNow(),
	stack: text().notNull()
});

export const unknownErrorLogs = pgTable('unknown_error_logs', {
	raw: jsonb().$type<unknown>().notNull(),
	timestamp: timestamp().notNull().defaultNow()
});

export const schema = {
	users,
	providers,
	errorLogs,
	unknownErrorLogs
};

export type SchemaType = typeof schema;
export type DatabaseType = NeonHttpDatabase<SchemaType>;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Provider = typeof providers.$inferSelect;
export type NewProvider = typeof providers.$inferInsert;

export type ErrorLog = typeof errorLogs.$inferSelect;
export type NewErrorLog = typeof errorLogs.$inferInsert;

export type UnknownErrorLog = typeof unknownErrorLogs.$inferSelect;
export type NewUnknownErrorLog = typeof unknownErrorLogs.$inferInsert;
