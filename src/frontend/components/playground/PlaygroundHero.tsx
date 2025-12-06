import { animated } from '@react-spring/web';
import type { ThemeProps } from '../../../types/springTypes';
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
			Select your stack — frameworks, databases, ORM, and more.
			<br />
			Same options you&apos;d see in the <code>bun create absolutejs</code> CLI.
			<br />
			Get the command to paste straight into your terminal.
		</animated.p>
	</section>
);