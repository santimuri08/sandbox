import { CSSProperties } from 'react';
import { ThemeSprings, AnimatedCSSProperties } from '../../types/springTypes';

export const mainContentStyle: CSSProperties = {
	display: 'flex',
	flex: 1,
	flexDirection: 'column',
	lineHeight: '1.7',
	margin: '0 auto',
	maxWidth: '60%',
	padding: '2rem 0',
	paddingRight: '4rem'
};

export const sectionStyle: CSSProperties = {
	marginBottom: '2rem'
};

export const headingStyle = (
	themeSprings: ThemeSprings,
	subheading: boolean = false
): AnimatedCSSProperties => ({
	borderTop: subheading
		? 'none'
		: themeSprings.themeTertiary.to((color) => `2px solid ${color}`),
	fontSize: subheading ? '1.5rem' : '1.875rem',
	fontWeight: '600',
	marginBottom: '1rem',
	paddingTop: '1rem'
});

export const paragraphStyle: CSSProperties = {
	fontSize: '1.0625rem',
	marginBottom: '1rem'
};

export const paragraphLargeStyle: CSSProperties = {
	fontSize: '1.125rem',
	marginBottom: '1rem'
};

export const paragraphSpacedStyle: CSSProperties = {
	fontSize: '1.0625rem',
	marginBottom: '1.5rem'
};

export const strongStyle: CSSProperties = {
	fontWeight: '600'
};

export const listStyle: CSSProperties = {
	listStyleType: 'disc',
	marginTop: '0.75rem',
	paddingLeft: '2rem'
};

export const listItemStyle: CSSProperties = {
	fontSize: '1.0625rem',
	marginBottom: '0.5rem'
};

export const h1Style: CSSProperties = {
	fontSize: '3rem',
	marginBottom: '1rem'
};

// Table of Contents Styles
export const tocNavStyle = (
	themeSprings: ThemeSprings
): AnimatedCSSProperties => ({
	borderLeft: '1px solid',
	borderLeftColor: themeSprings.contrastSecondary.to((color) => color),
	height: 'fit-content',
	maxHeight: 'calc(100vh - 4rem)',
	overflowY: 'auto',
	padding: '0 1.5rem',
	position: 'sticky',
	right: '4rem',
	top: '4rem',
	width: '20%'
});

export const tocTitleStyle = (
	themeSprings: ThemeSprings
): AnimatedCSSProperties => ({
	color: themeSprings.contrastPrimary,
	fontSize: '1rem',
	fontWeight: '600',
	letterSpacing: '0.05em',
	marginBottom: '1rem',
	textTransform: 'uppercase'
});

export const tocListStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	gap: '0.75rem',
	listStyle: 'none',
	margin: 0,
	padding: 0
};

export const tocLinkStyle = (
	themeSprings: ThemeSprings
): AnimatedCSSProperties => ({
	color: themeSprings.contrastPrimary,
	fontSize: '1rem',
	textDecoration: 'none',
	wordBreak: 'break-word'
});
