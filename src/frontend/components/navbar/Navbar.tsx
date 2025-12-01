import { animated, useSpring } from '@react-spring/web';
import { useRef } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { User } from '../../../../db/schema';
import { ThemeSprings, SetTheme } from '../../../types/springTypes';
import { navbarData } from '../../data/navbarData';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import {
	navbarContainerStyle,
	hamburgerButtonStyle
} from '../../styles/navbarStyles';
import { HamburgerMenu } from '../hamburger/HamburgerMenu';
import { NavbarLinks } from './NavbarLinks';
import { NavbarUserButtons } from './NavbarUserButtons';

type NavbarProps = {
	user: User | undefined;
	handleSignOut: () => Promise<void>;
	themeSprings: ThemeSprings;
	setTheme: SetTheme;
};

export const Navbar = ({
	user,
	handleSignOut,
	themeSprings,
	setTheme
}: NavbarProps) => {
	const { isSizeOrLess } = useMediaQuery();
	const isMobile = isSizeOrLess('sm');

	const navRef = useRef<HTMLDivElement>(null);

	const [hamburgerMenuSpring, hamburgerMenuApi] = useSpring(() => ({
		config: { friction: 40, tension: 275 },
		transform: 'translateX(100%)',
		onRest: () => {
			if (hamburgerMenuSpring.transform.get() === 'translateX(100%)') {
				document.body.style.overflow = '';
			}
		},
		onStart: () => {
			document.body.style.overflow = 'hidden';
		}
	}));

	const toggleHamburgerMenu = () => {
		const isOpen =
			hamburgerMenuSpring.transform.get() === 'translateX(100%)';
		void hamburgerMenuApi.start({
			transform: isOpen ? 'translateX(0%)' : 'translateX(100%)'
		});
	};

	return (
		<animated.header
			ref={navRef}
			style={navbarContainerStyle(themeSprings)}
		>
			<animated.a
				href="/"
				style={{
					color: themeSprings.contrastPrimary,
					fontSize: '1.5rem',
					fontWeight: 'bold',
					textDecoration: 'none'
				}}
			>
				AbsoluteJS
			</animated.a>

			<div
				style={{
					alignItems: 'center',
					display: 'flex'
				}}
			>
				{!isMobile && (
					<NavbarLinks
						navbarData={navbarData}
						themeSprings={themeSprings}
					/>
				)}

				<NavbarUserButtons
					user={user}
					handleSignOut={handleSignOut}
					themeSprings={themeSprings}
					setTheme={setTheme}
				/>

				{isMobile === true && (
					<button
						style={hamburgerButtonStyle}
						onClick={toggleHamburgerMenu}
					>
						<RxHamburgerMenu size={36} />
					</button>
				)}
			</div>

			<HamburgerMenu
				themeSprings={themeSprings}
				spring={hamburgerMenuSpring}
				springApi={hamburgerMenuApi}
				user={user}
				handleSignOut={handleSignOut}
			/>
		</animated.header>
	);
};
