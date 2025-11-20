import { animated, SpringValue } from '@react-spring/web';
import { ONE_HUNDRED_PERCENT } from '../../../constants';
import { ThemeSprings } from '../../../types/springTypes';

type CodeSliderProps = {
	handleTabClick: (index: number) => void;
	sliderSprings: {
		left: SpringValue<string>;
	};
	tabs: string[];
	themeSprings: ThemeSprings;
};

export const CodeSlider = ({
	handleTabClick,
	sliderSprings,
	tabs,
	themeSprings
}: CodeSliderProps) => (
	<div
		style={{
			display: 'flex',
			margin: '0.5rem 0',
			position: 'relative',
			width: '100%'
		}}
	>
		{tabs.map((tab, index) => (
			<animated.button
				key={index}
				style={{
					backgroundColor: 'transparent',
					border: 'none',
					borderBottom: '2px solid transparent',
					color: themeSprings.contrastPrimary,
					cursor: 'pointer',
					fontSize: '1rem',
					padding: '0.5rem',
					width: `${ONE_HUNDRED_PERCENT / tabs.length}%`
				}}
				onClick={() => handleTabClick(index)}
			>
				{tab}
			</animated.button>
		))}
		<animated.div
			style={{
				backgroundColor: themeSprings.contrastPrimary,
				borderTopLeftRadius: '4px',
				borderTopRightRadius: '4px',
				bottom: 0,
				height: '4px',
				left: sliderSprings.left,
				position: 'absolute',
				width: `${ONE_HUNDRED_PERCENT / tabs.length}%`
			}}
		/>
	</div>
);
