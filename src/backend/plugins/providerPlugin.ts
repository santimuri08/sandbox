import { isValidProviderOption } from '@absolutejs/auth';
import { Elysia } from 'elysia';
import { DatabaseType } from '../../../db/schema';
import { getProvider } from '../handlers/providerHandlers';

export const providerPlugin = (db: DatabaseType) =>
	new Elysia().get(
		'/api/v1/providers/:provider',
		async ({ error, params: { provider } }) => {
			if (!isValidProviderOption(provider)) {
				return error('Bad Request', `Invalid provider: ${provider}`);
			}
			const providerData = await getProvider({ db, name: provider });

			if (providerData === undefined) {
				return error(
					'Not Found',
					`Provider with name ${provider} not found`
				);
			}

			return providerData;
		}
	);
