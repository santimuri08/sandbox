import { useSpring } from '@react-spring/web';
import { useEffect, useRef } from 'react';
import {
	darkPrimaryColor,
	darkSecondaryColor,
	darkTertiaryColor,
	lightPrimaryColor,
	lightSecondaryColor,
	lightTertiaryColor
} from '../styles/colors';

export type ThemeMode = 'light' | 'dark' | 'system:light' | 'system:dark';

const createPalette = (mode: ThemeMode) => ({
	contrastPrimary: mode.endsWith('dark')
		? lightPrimaryColor
		: darkPrimaryColor,
	contrastSecondary: mode.endsWith('dark')
		? lightSecondaryColor
		: darkSecondaryColor,
	theme: mode,
	themePrimary: mode.endsWith('dark') ? darkPrimaryColor : lightPrimaryColor,
	themeSecondary: mode.endsWith('dark')
		? darkSecondaryColor
		: lightSecondaryColor,
	themeTertiary: mode.endsWith('dark')
		? darkTertiaryColor
		: lightTertiaryColor
});

export const useTheme = (initialTheme: ThemeMode | undefined) => {
	const browserEnvironmentAvailable =
		typeof window !== 'undefined' &&
		typeof window.matchMedia === 'function';

	const [themeSprings, themeSpringController] = useSpring(() =>
		createPalette(initialTheme ?? 'system:dark')
	);

	const mediaQueryRef = useRef<MediaQueryList | null>(null);

	const applySystemChange = (event: MediaQueryListEvent) => {
		const updatedThemeMode = event.matches ? 'system:dark' : 'system:light';
		themeSpringController.start(createPalette(updatedThemeMode));
		document.cookie = `theme=${updatedThemeMode}; Max-Age=31536000; Path=/`;
	};

	useEffect(() => {
		if (!browserEnvironmentAvailable) return undefined;

		const shouldFollowSystem =
			!initialTheme || initialTheme.startsWith('system');
		if (!shouldFollowSystem) return undefined;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQueryRef.current = mediaQuery;

		if (!mediaQuery.matches) {
			themeSpringController.start(createPalette('system:light'));
		}

		mediaQuery.addEventListener('change', applySystemChange);

		return () => {
			mediaQuery.removeEventListener('change', applySystemChange);
			mediaQueryRef.current = null;
		};
	}, []);

	const setTheme = (selectedTheme: 'light' | 'dark' | 'system') => {
		if (!browserEnvironmentAvailable) return;

		if (mediaQueryRef.current) {
			mediaQueryRef.current.removeEventListener(
				'change',
				applySystemChange
			);
			mediaQueryRef.current = null;
		}

		let nextThemeMode: ThemeMode;
		if (selectedTheme === 'system') {
			const mediaQuery = window.matchMedia(
				'(prefers-color-scheme: dark)'
			);
			nextThemeMode = mediaQuery.matches ? 'system:dark' : 'system:light';
			mediaQuery.addEventListener('change', applySystemChange);
			mediaQueryRef.current = mediaQuery;
		} else {
			nextThemeMode = selectedTheme;
		}

		themeSpringController.start(createPalette(nextThemeMode));
		document.cookie = `theme=${nextThemeMode}; Max-Age=31536000; Path=/`;
	};

	return [themeSprings, setTheme] as const;
};
