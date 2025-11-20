import { CSSProperties } from 'react';
import {
	AnimatedCSSProperties,
	ThemeSprings
} from '../../types/springTypes';

export const playgroundWrapperStyle = (
	themeSprings: ThemeSprings
): AnimatedCSSProperties => ({
	backgroundColor: themeSprings.themeTertiary,
	borderRadius: '16px',
	boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)',
	margin: '2rem auto 4rem',
	maxWidth: '1200px',
	padding: '2rem',
	width: '95%'
});

export const playgroundGridBase: CSSProperties = {
	display: 'grid',
	gap: '2rem',
	alignItems: 'flex-start'
};

export const commandCardStyle = (
	themeSprings: ThemeSprings
): AnimatedCSSProperties => ({
	backgroundColor: themeSprings.themeSecondary,
	borderRadius: '12px',
	boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
	padding: '1.5rem',
	minHeight: '180px'
});

export const formCardStyle = (
	themeSprings: ThemeSprings
): AnimatedCSSProperties => ({
	backgroundColor: themeSprings.themeSecondary,
	borderRadius: '12px',
	boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
	padding: '1.5rem'
});

export const sectionTitleStyle: CSSProperties = {
	fontSize: '1.1rem',
	fontWeight: 600,
	marginBottom: '0.5rem'
};

export const sectionSubtitleStyle: CSSProperties = {
	fontSize: '0.9rem',
	opacity: 0.85,
	marginBottom: '0.75rem'
};

export const fieldsetStyle: CSSProperties = {
	border: '1px solid rgba(255, 255, 255, 0.08)',
	borderRadius: '10px',
	marginBottom: '1.25rem',
	padding: '1rem'
};

export const legendStyle: CSSProperties = {
	fontSize: '0.9rem',
	fontWeight: 600,
	padding: '0 0.4rem'
};

export const inputsGridStyle: CSSProperties = {
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
	gap: '0.5rem 1rem',
	marginTop: '0.75rem'
};

export const checkboxRowStyle: CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	gap: '0.5rem',
	fontSize: '0.9rem'
};

export const radioRowStyle: CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	gap: '0.5rem',
	fontSize: '0.9rem'
};

export const textInputStyle: CSSProperties = {
	width: '100%',
	padding: '0.5rem 0.75rem',
	borderRadius: '6px',
	border: '1px solid rgba(255, 255, 255, 0.18)',
	backgroundColor: 'rgba(0, 0, 0, 0.2)',
	color: 'inherit',
	fontSize: '0.9rem'
};

export const commandLabelStyle: CSSProperties = {
	fontSize: '0.85rem',
	opacity: 0.8,
	marginBottom: '0.5rem'
};

export const commandCodeStyle: CSSProperties = {
	background: 'rgba(0, 0, 0, 0.55)',
	borderRadius: '10px',
	fontFamily: 'monospace',
	fontSize: '0.9rem',
	lineHeight: 1.5,
	marginTop: '0.5rem',
	padding: '0.75rem 0.9rem',
	overflowX: 'auto',
	whiteSpace: 'pre'
};

export const commandHeaderRowStyle: CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: '0.75rem',
	marginBottom: '0.5rem'
};

export const commandTitleStyle: CSSProperties = {
	fontSize: '1rem',
	fontWeight: 600
};
