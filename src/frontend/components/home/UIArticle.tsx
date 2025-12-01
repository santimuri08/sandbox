import { animated } from '@react-spring/web';
import { ThemeProps } from '../../../types/springTypes';
import { featureCard } from '../../styles/homeStyles';
import { headingStyle, paragraphStyle } from '../../styles/styles';

export const UIArticle = ({ themeSprings }: ThemeProps) => (
	<animated.article style={featureCard(themeSprings)}>
		<animated.h2 style={headingStyle(themeSprings)}>
			Seamless UI Integration
		</animated.h2>
		<animated.p style={paragraphStyle(themeSprings)}>
			AbsoluteJS is a true multi-page app framework. Build each route
			using React, Angular, Vue, Svelte, HTML, or HTMX. AbsoluteJS
			automatically handles the build process and outputs ready to run
			JavaScript. To port an existing page, simply drop its components
			into the matching folder, with no custom build steps, hidden config,
			or framework specific tooling required. The result is uniform
			performance, a seamless user experience, and a developer workflow
			that is both lightning fast and future proof.
		</animated.p>
	</animated.article>
);
