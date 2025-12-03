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
	alignItems: 'flex-start', display: 'grid', gap: '2rem'
};

export const commandCardStyle = (
	themeSprings: ThemeSprings
): AnimatedCSSProperties => ({
	backgroundColor: themeSprings.themeSecondary, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)', minHeight: '180px', padding: '1.5rem'
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
	fontSize: '0.9rem', marginBottom: '0.75rem', opacity: 0.85
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
	display: 'grid', gap: '0.5rem 1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginTop: '0.75rem'
};

export const checkboxRowStyle: CSSProperties = {
	alignItems: 'center', display: 'flex', fontSize: '0.9rem', gap: '0.5rem'
};

export const radioRowStyle: CSSProperties = {
	alignItems: 'center', display: 'flex', fontSize: '0.9rem', gap: '0.5rem'
};

export const textInputStyle: CSSProperties = {
	backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.18)', borderRadius: '6px', color: 'inherit', fontSize: '0.9rem', padding: '0.5rem 0.75rem', width: '100%'
};

export const commandLabelStyle: CSSProperties = {
	fontSize: '0.85rem', marginBottom: '0.5rem', opacity: 0.8
};

export const commandCodeStyle: CSSProperties = {
	background: 'rgba(0, 0, 0, 0.55)', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '0.5rem', overflowX: 'auto', padding: '0.75rem 0.9rem', whiteSpace: 'pre'
};

export const commandHeaderRowStyle: CSSProperties = {
	alignItems: 'center', display: 'flex', gap: '0.75rem', justifyContent: 'space-between', marginBottom: '0.5rem'
};

export const commandTitleStyle: CSSProperties = {
	fontSize: '1rem',
	fontWeight: 600
};
