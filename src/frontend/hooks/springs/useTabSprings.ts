import { useSpring } from '@react-spring/web';
import { useState } from 'react';
import { ONE_HUNDRED_PERCENT } from '../../../constants';

export const useTabSprings = (numTabs: number) => {
	const [currentTab, setCurrentTab] = useState(0);
	const [sliderSprings, sliderApi] = useSpring(() => ({
		config: {
			duration: 200
		},
		left: `${(ONE_HUNDRED_PERCENT / numTabs) * currentTab}%`
	}));

	const handleTabClick = (index: number) => {
		sliderApi.start({
			left: `${(ONE_HUNDRED_PERCENT / numTabs) * index}%`
		});
		setCurrentTab(index);
	};

	return { currentTab, handleTabClick, sliderSprings };
};
