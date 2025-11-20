import { CSSProperties } from 'react';
import { AnimatedCSSProperties, ThemeSprings } from '../../types/springTypes';

export const highlighterContainerStyle: CSSProperties = {
	borderRadius: '5px',
	overflow: 'hidden',
	position: 'relative',
	width: '100%'
};

export const highlighterHeaderStyle = (
	themeSprings: ThemeSprings
): AnimatedCSSProperties => ({
	alignItems: 'center',
	backgroundColor: themeSprings.themeSecondary,
	display: 'flex',
	justifyContent: 'space-between',
	padding: '5px 10px'
});

export const highlighterSelectContainerStyle: CSSProperties = {
	display: 'inline-block',
	marginLeft: '10px',
	position: 'relative'
};

export const highlighterSelectStyle: CSSProperties = {
	appearance: 'none',
	background: 'transparent',
	border: 'none',
	color: '#333',
	cursor: 'pointer',
	fontSize: '0.9em',
	MozAppearance: 'none',
	outline: 'none',
	paddingLeft: '0',
	paddingRight: '20px',
	WebkitAppearance: 'none'
};

export const selectArrowStyle: CSSProperties = {
	pointerEvents: 'none',
	position: 'absolute',
	right: '5px',
	top: '50%',
	transform: 'translateY(-50%)'
};
