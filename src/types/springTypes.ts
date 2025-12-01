import { AnimatedProps } from '@react-spring/web';
import { CSSProperties } from 'react';
import { useSidebarSprings } from '../frontend/hooks/springs/useSidebarSprings';
import { useTheme } from '../frontend/hooks/useTheme';

export type AnimatedCSSProperties = AnimatedProps<CSSProperties>;

export type ThemeSprings = ReturnType<typeof useTheme>[0];
export type SetTheme = ReturnType<typeof useTheme>[1];

export type ThemeProps = {
	themeSprings: ThemeSprings;
};

export type SidebarLinksSprings = ReturnType<
	typeof useSidebarSprings
>['linksSprings'];
export type SidebarLinksApi = ReturnType<typeof useSidebarSprings>['linksApi'];
