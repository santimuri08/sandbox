import { useSprings } from '@react-spring/web';
import { DocsView, isMenuDropdown } from '../../../types/types';
import { sidebarData } from '../../data/sidebarData';
import { primaryColor, lightTertiaryColor } from '../../styles/colors';

type Acc = {
	counts: number[];
	offset: number;
	totalButtons: number;
	selectedIndex: number;
};

export const useSidebarSprings = (view: DocsView) => {
	const {
		counts: dropdownButtonCounts,
		totalButtons,
		selectedIndex
	} = sidebarData.reduce<Acc>(
		(acc, item) => {
			if (isMenuDropdown(item)) {
				const count = item.buttons.length;
				const idx = item.buttons.findIndex(
					(button) => button.id === view
				);
				if (idx !== -1) acc.selectedIndex = acc.offset + idx;
				acc.counts.push(count);
				acc.offset += count;
				acc.totalButtons += count;

				return acc;
			}
			acc.counts.push(1);
			if (item.id === view) acc.selectedIndex = acc.offset;
			acc.offset += 1;
			acc.totalButtons += 1;

			return acc;
		},
		{ counts: [], offset: 0, selectedIndex: -1, totalButtons: 0 }
	);

	const [linksSprings, linksApi] = useSprings(totalButtons, (index) => ({
		backgroundColor: index === selectedIndex ? primaryColor : 'transparent',
		borderColor:
			index === selectedIndex ? primaryColor : lightTertiaryColor,
		config: { duration: 150, friction: 30, tension: 250 }
	}));

	const startIndexForDropdown = (dropdownIndex: number) =>
		dropdownButtonCounts
			.slice(0, dropdownIndex)
			.reduce((sum, count) => sum + count, 0);

	return {
		linksApi,
		linksSprings,
		startIndexForDropdown
	};
};
