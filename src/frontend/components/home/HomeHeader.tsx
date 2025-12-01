import { animated } from '@react-spring/web';
import { ThemeProps } from '../../../types/springTypes';
import { headingStyle, paragraphStyle } from '../../styles/styles';

export const HomeHeader = ({ themeSprings }: ThemeProps) => (
	<section
		style={{
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'column',
			textAlign: 'center'
		}}
	>
		<animated.h1 style={headingStyle(themeSprings)}>
			The Last Fullstack JavaScript Meta-Framework You'll Ever Need
		</animated.h1>
		<animated.p style={paragraphStyle(themeSprings)}>
			AbsoluteJS brings together every aspect of modern web development.
			It covers user interfaces, data handling, code quality,
			authentication, and payment processing.
		</animated.p>
		<animated.p style={paragraphStyle(themeSprings)}>
			With AbsoluteJS, you can build fullstack applications with
			lightning-fast performance, a rich user experience, and a consistent
			developer experience.
		</animated.p>
	</section>
);
