import { t } from 'elysia/type-system';
import { docsViews } from '../frontend/data/sidebarData';
import { isValidViewId } from './typeGuards';

export const themeCookie = t.Cookie({
	theme: t.Optional(
		t.Union([
			t.Literal('light'),
			t.Literal('dark'),
			t.Literal('system:light'),
			t.Literal('system:dark')
		])
	)
});

export const docsViewEnum = t.Enum(
	Object.fromEntries(
		Object.keys(docsViews)
			.filter(isValidViewId)
			.map((key) => [key, key])
	)
);
