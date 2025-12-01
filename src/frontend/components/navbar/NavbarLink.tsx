import { animated } from '@react-spring/web';
import { ReactNode } from 'react';
import { ThemeSprings } from '../../../types/springTypes';
import {
	optionStyle,
	navbarDrowdownLinkStyle
} from '../../styles/navbarStyles';

type NavbarLinkProps = {
	icon?: ReactNode;
	href: string;
	label: string;
	themeSprings: ThemeSprings;
};

export const NavbarLink = ({
	icon,
	href,
	label,
	themeSprings
}: NavbarLinkProps) => (
	<a href={href} style={optionStyle}>
		{icon}
		<animated.span style={navbarDrowdownLinkStyle(themeSprings)}>
			{label}
		</animated.span>
	</a>
);
