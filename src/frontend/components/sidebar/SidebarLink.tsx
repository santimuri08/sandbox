import { animated, AnimatedComponent } from '@react-spring/web';
import { IconType } from 'react-icons';
import {
	SidebarLinksApi,
	SidebarLinksSprings,
	ThemeSprings
} from '../../../types/springTypes';
import { DocsView } from '../../../types/types';
import { lightTertiaryColor, primaryColor } from '../../styles/colors';

type SidebarLinkProps = {
	icon?: AnimatedComponent<IconType>;
	label: string;
	themeSprings: ThemeSprings;
	linkSprings?: SidebarLinksSprings[number];
	linksApi?: SidebarLinksApi;
	id: DocsView;
	view: DocsView;
	index: number;
	navigateToView: (newView: DocsView) => void;
};

export const SidebarLink = ({
	icon,
	linkSprings,
	linksApi,
	index,
	view,
	id,
	navigateToView,
	label,
	themeSprings
}: SidebarLinkProps) => {
	const Icon = icon;
	const isOverview = id === 'overview';

	return (
		<animated.button
			style={{
				alignItems: 'center',
				backgroundColor: 'transparent',
				border: 'none',
				borderLeftColor: linkSprings?.borderColor,
				borderLeftStyle: isOverview ? 'none' : 'solid',
				borderLeftWidth: isOverview ? '0' : '3px',
				color: themeSprings.contrastSecondary,
				cursor: 'pointer',
				display: 'flex',
				marginLeft: isOverview ? '0' : '0.5rem',
				paddingLeft: isOverview ? '0' : '1rem',
				position: 'relative',
				width: '100%'
			}}
			onMouseEnter={() => {
				linksApi?.start((i) => {
					if (i !== index || view === id) return undefined;

					return { backgroundColor: lightTertiaryColor };
				});
			}}
			onMouseLeave={() => {
				linksApi?.start((i) => {
					if (i !== index || view === id) return undefined;

					return { backgroundColor: 'transparent' };
				});
			}}
			onClick={() => {
				navigateToView(id);
				linksApi?.start((i) => {
					if (i === index) {
						return {
							backgroundColor: primaryColor,
							borderColor: primaryColor
						};
					}

					return {
						backgroundColor: 'transparent',
						borderColor: lightTertiaryColor
					};
				});
			}}
		>
			<animated.div
				style={{
					backgroundColor: linkSprings?.backgroundColor,
					inset: 0,
					opacity: 0.3,
					pointerEvents: 'none',
					position: 'absolute',
					zIndex: -1
				}}
			/>
			{Icon && <Icon />}
			<animated.span
				style={{
					alignItems: 'center',
					color: themeSprings.contrastSecondary,
					display: 'flex',
					fontSize: '1rem',
					fontWeight: isOverview ? 'bold' : 'normal',
					marginLeft: icon ? '0.5rem' : '0',
					padding: '0.5rem 0',
					textDecoration: 'none'
				}}
			>
				{label}
			</animated.span>
		</animated.button>
	);
};
