import { ProviderOption } from '@absolutejs/auth';
import { animated } from '@react-spring/web';
import { useState } from 'react';
import { ThemeProps } from '../../../types/springTypes';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import {
	containerStyle,
	headingStyle,
	loginTextStyle,
	loginLinkTextStyle
} from '../../styles/authModalStyles';
import { Divider } from '../utils/Divider';
import { ProviderDropdown } from '../utils/ProviderDropdown';
import { OAuthLink } from './OAuthLink';

export const AuthContainer = ({ themeSprings }: ThemeProps) => {
	const [currentProvider, setCurrentProvider] =
		useState<Lowercase<ProviderOption>>();
	const [mode, setMode] = useState<'login' | 'signup'>('login');
	const switchMode = () => {
		setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
	};
	const { isSizeOrLess } = useMediaQuery();
	const isMobile = isSizeOrLess('sm');

	return (
		<div style={containerStyle(isMobile)}>
			<animated.a
				href="/"
				style={{
					color: themeSprings.contrastPrimary,
					fontSize: '1.5rem',
					fontWeight: 'bold',
					textDecoration: 'none'
				}}
			>
				AbsoluteJS
			</animated.a>
			<h1 style={headingStyle}>
				{mode === 'login'
					? 'Sign in to your Account'
					: 'Create an account'}
			</h1>

			<OAuthLink
				mode={mode}
				provider="google"
				themeSprings={themeSprings}
			/>
			<OAuthLink
				mode={mode}
				provider="github"
				themeSprings={themeSprings}
			/>

			<Divider text="or" />

			<ProviderDropdown
				setCurrentProvider={setCurrentProvider}
				themeSprings={themeSprings}
			/>

			<OAuthLink
				mode={mode}
				provider={currentProvider}
				themeSprings={themeSprings}
			/>

			<animated.p style={loginTextStyle(themeSprings)}>
				{mode === 'login' ? 'Need an account? ' : 'Have an account? '}
				<animated.button
					style={loginLinkTextStyle(themeSprings)}
					onClick={switchMode}
				>
					{mode === 'login' ? 'Sign Up' : 'Sign In'}
				</animated.button>
			</animated.p>
		</div>
	);
};
