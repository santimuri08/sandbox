import { animated } from '@react-spring/web';
import { ThemeSprings } from '../../../types/springTypes';
import { DocsView, isMenuDropdown } from '../../../types/types';
import { sidebarData } from '../../data/sidebarData';
import { useSidebarSprings } from '../../hooks/springs/useSidebarSprings';
import { SidebarDropdown } from './SidebarDropdown';
import { SidebarLink } from './SidebarLink';

type SidebarProps = {
	view: DocsView;
	themeSprings: ThemeSprings;
	navigateToView: (newView: DocsView) => void;
};

export const Sidebar = ({
	view,
	themeSprings,
	navigateToView
}: SidebarProps) => {
	const { linksSprings, linksApi, startIndexForDropdown } =
		useSidebarSprings(view);

	return (
		<animated.aside
			style={{
				borderColor: themeSprings.themeTertiary,
				borderRight: '2px solid',
				flexShrink: 0,
				height: '100%',
				maxHeight: '100%',
				overflowY: 'auto',
				padding: '1rem'
			}}
		>
			{sidebarData.map((element, index) => {
				if (isMenuDropdown(element)) {
					return (
						<SidebarDropdown
							view={view}
							linksSprings={linksSprings}
							linksApi={linksApi}
							startIndex={startIndexForDropdown(index)}
							navigateToView={navigateToView}
							key={element.label}
							label={element.label}
							buttons={element.buttons}
							icon={element.icon}
							themeSprings={themeSprings}
						/>
					);
				}

				const linkSprings = linksSprings[index];
				if (linkSprings === undefined) {
					throw new Error(
						'Internal index error in Sidebar component'
					);
				}

				return (
					<SidebarLink
						view={view}
						index={-1}
						icon={element.icon}
						linksApi={linksApi}
						id={element.id}
						key={element.label}
						navigateToView={navigateToView}
						label={element.label}
						themeSprings={themeSprings}
					/>
				);
			})}
		</animated.aside>
	);
};
