import { animated } from '@react-spring/web';
import { ThemeProps } from '../../../types/springTypes';
import { featureCard } from '../../styles/homeStyles';
import { headingStyle, paragraphStyle } from '../../styles/styles';

export const CodeQualityArticle = ({ themeSprings }: ThemeProps) => (
	<animated.article style={featureCard(themeSprings)}>
		<animated.h2 style={headingStyle(themeSprings)}>
			Code Quality Tools
		</animated.h2>
		<animated.p style={paragraphStyle(themeSprings)}>
			When you scaffold a new project, choose either ESLint with Prettier
			or Biome. Each option includes opinionated default configurations.
			Our custom ESLint rules ensure clean, readable, and type safe code.
			All settings remain fully editable so you can tailor rules to your
			needs. By catching style issues and potential errors before code
			reaches reviews, AbsoluteJS keeps teams aligned, accelerates PR
			approvals, and maintains consistent code quality.
		</animated.p>
	</animated.article>
);
