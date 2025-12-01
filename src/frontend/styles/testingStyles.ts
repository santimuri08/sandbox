import { CSSProperties } from 'react';
import { AnimatedCSSProperties, ThemeSprings } from '../../types/springTypes';

export const legendWrapperStyle = (
	themeSprings: ThemeSprings
): AnimatedCSSProperties => ({
	backgroundColor: themeSprings.themeTertiary,
	borderRadius: '8px',
	boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
	margin: '0 auto 2rem',
	maxWidth: '1200px',
	padding: '20px',
	width: '90%'
});

export const legendTitleStyle: CSSProperties = {
	fontSize: '1.25rem',
	fontWeight: 600,
	margin: '0 0 16px',
	textAlign: 'center'
};

export const legendFooterStyle: CSSProperties = {
	margin: '16px 0 0',
	textAlign: 'center'
};

export const badgeStyle = (
	backgroundColor: string,
	textColor = '#fff'
): CSSProperties => ({
	alignItems: 'center',
	backgroundColor,
	borderRadius: '50%',
	color: textColor,
	display: 'flex',
	flexShrink: 0,
	fontSize: '1.2rem',
	height: '2rem',
	justifyContent: 'center',
	width: '2rem'
});

export const legendTextStyle: CSSProperties = {
	fontSize: '1rem',
	lineHeight: 1.6,
	margin: 0,
	textAlign: 'left'
};
