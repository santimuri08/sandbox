import { docsViews } from '../frontend/data/sidebarData';
import { DocsView } from './types';

export const isNonEmptyString = (
	str: string | null | undefined
): str is string => str !== null && str !== undefined && str.trim() !== '';

export const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null;

export const isLightOrDark = (value: unknown): value is 'light' | 'dark' =>
	value === 'light' || value === 'dark';

export const isValidViewId = (viewId: string): viewId is DocsView =>
	viewId in docsViews;
