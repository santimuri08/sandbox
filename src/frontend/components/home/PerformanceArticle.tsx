import { animated } from '@react-spring/web';
import { ThemeProps } from '../../../types/springTypes';
import {
	featureCard,
	linkContainerStyle,
	logoImageStyle,
	navContainerStyle
} from '../../styles/homeStyles';
import { headingStyle, paragraphStyle } from '../../styles/styles';

export const PerformanceArticle = ({ themeSprings }: ThemeProps) => (
	<animated.article style={featureCard(themeSprings)}>
		<animated.h2 style={headingStyle(themeSprings)}>
			Built for Modern Performance
		</animated.h2>
		<animated.p style={paragraphStyle(themeSprings)}>
			AbsoluteJS combines Bun's ultra-fast JavaScript runtime with
			Elysia's zero-overhead framework to achieve significantly higher
			request throughput than other common solutions. Leveraging Elysia
			for server-side rendering, pages are fully rendered on the server
			and streamed to the client, minimizing client-side processing for a
			smooth, responsive UX.
		</animated.p>

		<nav style={navContainerStyle}>
			<animated.a
				href="https://bun.sh"
				target="_blank"
				rel="noopener noreferrer"
				style={linkContainerStyle(themeSprings)}
			>
				<img
					src="/assets/svg/bun-logo.svg"
					alt="Bun Logo"
					style={logoImageStyle}
				/>
				Learn more about Bun
			</animated.a>

			<animated.a
				href="https://elysiajs.com"
				target="_blank"
				rel="noopener noreferrer"
				style={linkContainerStyle(themeSprings)}
			>
				<img
					src="/assets/svg/elysia.svg"
					alt="Elysia Logo"
					style={logoImageStyle}
				/>
				Learn more about Elysia
			</animated.a>
		</nav>
	</animated.article>
);
