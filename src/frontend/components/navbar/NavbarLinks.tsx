import { ThemeSprings } from '../../../types/springTypes';
import { isNavbarDropdown, NavbarElement } from '../../../types/types';
import { NavbarDropdown } from './NavbarDropdown';
import { NavbarLink } from './NavbarLink';

type NavbarLinksProps = {
	navbarData: NavbarElement[];
	themeSprings: ThemeSprings;
};

export const NavbarLinks = ({ navbarData, themeSprings }: NavbarLinksProps) => (
	<nav
		style={{
			alignItems: 'center',
			display: 'flex',
			gap: '10px',
			justifyContent: 'center'
		}}
	>
		{navbarData.map((element) => {
			if (isNavbarDropdown(element)) {
				return (
					<NavbarDropdown
						themeSprings={themeSprings}
						key={element.label}
						label={element.label}
						href={element.href}
						links={element.links}
					/>
				);
			}

			return (
				<NavbarLink
					themeSprings={themeSprings}
					key={element.label}
					icon={element.icon}
					href={element.href}
					label={element.label}
				/>
			);
		})}
	</nav>
);
