import { animated } from '@react-spring/web';
import { ThemeProps } from '../../../types/springTypes';
import { typeArticleData } from '../../data/typeArticleData';
import { useTabSprings } from '../../hooks/springs/useTabSprings';
import { featureCard } from '../../styles/homeStyles';
import { headingStyle, paragraphStyle } from '../../styles/styles';
import { PrismPlus } from '../utils/PrismPlus';
import { CodeSlider } from './CodeSlider';

export const TypeSafeArticle = ({ themeSprings }: ThemeProps) => {
	const { handleTabClick, currentTab, sliderSprings } = useTabSprings(
		typeArticleData.length
	);

	const { codeString, title, description, language } =
		typeArticleData[currentTab] ?? {};

	if (
		codeString === undefined ||
		title === undefined ||
		description === undefined
	) {
		return null;
	}

	return (
		<animated.article style={featureCard(themeSprings)}>
			<animated.h2 style={headingStyle(themeSprings)}>
				Type Safe All Around
			</animated.h2>
			<animated.p style={paragraphStyle(themeSprings)}>
				Maximize the power of TypeScript with AbsoluteJS. From the
				database, to the backend, to the frontend, you can be confident
				in the shape of your data.
			</animated.p>
			<CodeSlider
				handleTabClick={handleTabClick}
				sliderSprings={sliderSprings}
				tabs={typeArticleData.map((item) => item.title)}
				themeSprings={themeSprings}
			/>
			<PrismPlus
				themeSprings={themeSprings}
				codeString={codeString}
				language={language}
			/>
			<animated.p style={paragraphStyle(themeSprings)}>
				{description}
			</animated.p>
		</animated.article>
	);
};
