import {
	backendCode,
	databaseCode,
	frontendCode,
	treatyCode
} from './typeSafeCode';

type TypeArticleData = {
	codeString: string;
	description: string;
	language: string;
	title: string;
};

export const typeArticleData: TypeArticleData[] = [
	{
		codeString: databaseCode,
		description:
			'Define your database schema with type safety using an ORM like Drizzle.',
		language: 'typescript',
		title: 'Database'
	},
	{
		codeString: backendCode,
		description:
			"Build your backend and Elysia's built in typebox integration will infer types from your routes.",
		language: 'typescript',
		title: 'Backend'
	},
	{
		codeString: treatyCode,
		description:
			'Eden treaty is the bridge between our server and UI. Eden takes the type of our server and allows us to make type safe API requests.',
		language: 'typescript',
		title: 'Treaty'
	},
	{
		codeString: frontendCode,
		description:
			'When you use the treaty to make frontend requests, you get back a fully typed object with two fields: `data`, the successful response payload, and `error`, an object typed to any non-2xx response (status and message) the route is configured to return.',
		language: 'tsx',
		title: 'Frontend'
	}
];
