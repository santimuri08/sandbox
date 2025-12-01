import { animated } from '@react-spring/web';
import { ThemeProps } from '../../../types/springTypes';

export const AuthTestingHero = ({ themeSprings }: ThemeProps) => (
	<animated.p
		style={{
			backgroundColor: themeSprings.themeTertiary,
			borderRadius: '8px',
			boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
			margin: '0 auto 2rem',
			maxWidth: '1200px',
			padding: '20px',
			textAlign: 'center',
			width: '90%'
		}}
	>
		Below is a list of all supported providers, including relevant
		information tags and their current status.
		<br />
		<br />
		Test providers from this screen by opening a provider's tab—you'll find
		a link to create an OAuth app on that provider and controls to exercise
		each step of the OAuth 2.0 flow.
	</animated.p>
);
