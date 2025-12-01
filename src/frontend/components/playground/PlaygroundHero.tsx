import { animated } from '@react-spring/web';
import { ThemeProps } from '../../../types/springTypes';
import { headingStyle, paragraphStyle } from '../../styles/styles';

export const PlaygroundHero = ({ themeSprings }: ThemeProps) => (
	<section
		style={{
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'column',
			gap: '1rem',
			margin: '3rem auto 1rem',
			maxWidth: '900px',
			padding: '0 1.5rem',
			textAlign: 'center'
		}}
	>
		<animated.h1 style={headingStyle(themeSprings)}>
			Try AbsoluteJS without touching your terminal
		</animated.h1>
		<animated.p style={paragraphStyle(themeSprings)}>
			Pick the same options you&apos;d see in the{' '}
			<code>bun create absolutejs</code> CLI — frameworks, database, ORM,
			auth, linting, Tailwind, and more. We&apos;ll show you the matching
			command so you can paste it straight into your terminal.
		</animated.p>
	</section>
);
