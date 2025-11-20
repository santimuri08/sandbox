import { animated, useSpring } from '@react-spring/web';
import { ReactNode } from 'react';
import { ThemeSprings } from '../../../types/springTypes';
import { NavbarLink as NavbarLinkType } from '../../../types/types';
import { useContainerQuery } from '../../hooks/useContainerQuery';
import { labelStyle } from '../../styles/authModalStyles';
import { NavbarLink } from '../navbar/NavbarLink';
import { AnimatedFaChevronDown } from '../utils/AnimatedComponents';

type HamburgerDropdownProps = {
	label: string;
	href: string;
	links: NavbarLinkType[];
	icon?: ReactNode;
	themeSprings: ThemeSprings;
};

export const HamburgerDropdown = ({
	label,
	icon,
	href,
	links,
	themeSprings
}: HamburgerDropdownProps) => {
	const {
		ref,
		dimensions: { scrollHeight }
	} = useContainerQuery<HTMLDivElement>();
	const [dropdownSprings, dropdownApi] = useSpring(() => ({
		config: { friction: 30, tension: 250 },
		height: 0,
		opacity: 0,
		transform: 'rotate(180deg)'
	}));

	// TODO: Update the rule to handle icons or other components someone doesnt control
	// eslint-disable-next-line absolute/localize-react-props
	const toggleDropdown = () => {
		if (ref === null) return;

		const isOpen = dropdownSprings.opacity.get() > 0;

		void dropdownApi.start({
			height: isOpen ? 0 : scrollHeight,
			opacity: isOpen ? 0 : 1,
			transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
		});
	};

	return (
		<div style={{ width: '100%' }}>
			<div
				style={{
					alignItems: 'center',
					display: 'flex',
					justifyContent: 'space-between'
				}}
			>
				<animated.a href={href} style={labelStyle(themeSprings)}>
					{icon}
					<span>{label}</span>
				</animated.a>
				<AnimatedFaChevronDown
					onClick={toggleDropdown}
					style={{
						cursor: 'pointer',
						fontSize: '1.7rem',
						marginLeft: '10px',
						transform: dropdownSprings.transform,
						transformOrigin: 'center'
					}}
				/>
			</div>
			<animated.nav
				ref={ref}
				style={{
					height: dropdownSprings.height,
					opacity: dropdownSprings.opacity,
					overflow: 'hidden'
				}}
			>
				{links.map((link, index) => (
					<NavbarLink
						themeSprings={themeSprings}
						key={index}
						icon={link.icon}
						href={link.href}
						label={link.label}
					/>
				))}
			</animated.nav>
		</div>
	);
};
