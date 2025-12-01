import { animated } from '@react-spring/web';
import { ThemeSprings } from '../../../../../types/springTypes';
import { EslintDocsSection } from '../../../../data/documentation/eslintDocsData';
import { useTabSprings } from '../../../../hooks/springs/useTabSprings';
import {
	sectionStyle,
	headingStyle,
	paragraphStyle
} from '../../../../styles/docsStyles';
import { CodeSlider } from '../../../home/CodeSlider';
import { PrismPlus } from '../../../utils/PrismPlus';

type EslintSectionProps = {
	section: EslintDocsSection;
	themeSprings: ThemeSprings;
}

export const EslintSection = ({
	section,
	themeSprings
}: EslintSectionProps) => {
	const { handleTabClick, currentTab, sliderSprings } = useTabSprings(2);

	return (
		<section style={sectionStyle} id={section.href.replace('#', '')}>
			<animated.h2 style={headingStyle(themeSprings)}>
				{section.title}
			</animated.h2>
			<p style={paragraphStyle}>{section.description}</p>
			<CodeSlider
				handleTabClick={handleTabClick}
				sliderSprings={sliderSprings}
				tabs={['Before', 'After']}
				themeSprings={themeSprings}
			/>
			<PrismPlus
				codeString={
					currentTab === 0 ? section.beforeCode : section.afterCode
				}
				language="typescript"
				showLineNumbers={false}
				themeSprings={themeSprings}
			/>
		</section>
	);
};
