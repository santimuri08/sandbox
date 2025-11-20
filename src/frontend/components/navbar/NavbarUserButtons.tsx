import { animated, useSpring } from '@react-spring/web';
import { useRef, useState } from 'react';
import { User } from '../../../../db/schema';
import { ThemeSprings, SetTheme } from '../../../types/springTypes';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { profileButtonStyle } from '../../styles/navbarStyles';
import { buttonStyle } from '../../styles/styles';
import { AuthContainer } from '../auth/AuthContainer';
import { AnimatedProfilePicture } from '../utils/AnimatedComponents';
import { Modal } from '../utils/Modal';
import { DropdownContainer } from './DropdownContainer';
import { ThemeButton } from './ThemeButton';

type NavbarUserButtonsProps = {
	user: User | undefined;
	handleSignOut: () => Promise<void>;
	themeSprings: ThemeSprings;
	setTheme: SetTheme;
};

export const NavbarUserButtons = ({
	user,
	handleSignOut,
	themeSprings,
	setTheme
}: NavbarUserButtonsProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { isSizeOrLess } = useMediaQuery();
	const isMobile = isSizeOrLess('sm');

	const openDropdown = () => {
		setIsDropdownOpen(true);
		void loginDropdownApi.start({ opacity: 1, scale: 1 });
	};

	const closeDropdown = () => {
		setIsDropdownOpen(false);
		void loginDropdownApi.start({ opacity: 0, scale: 0 });
	};

	const handleLoginClick = () => {
		if (isDropdownOpen) {
			closeDropdown();
		} else {
			openDropdown();
		}
	};

	const [loginDropdownSpring, loginDropdownApi] = useSpring(() => ({
		config: { friction: 20, tension: 250 },
		opacity: 0,
		scale: 0
	}));

	const userButtonRef = useRef<HTMLButtonElement>(null);

	return (
		<div
			style={{
				display: 'flex',
				marginLeft: '1rem',
				position: 'relative'
			}}
		>
			<animated.button
				ref={userButtonRef}
				onClick={user ? () => handleSignOut() : handleLoginClick}
				style={buttonStyle({
					backgroundColor: themeSprings.themeTertiary,
					color: themeSprings.contrastPrimary
				})}
			>
				{user ? 'Sign Out' : 'Login'}
			</animated.button>
			{user !== undefined && !isMobile && (
				<animated.a style={profileButtonStyle} href="/protected">
					<AnimatedProfilePicture
						themeSprings={themeSprings}
						userImage={
							typeof user.metadata?.profile_picture === 'string'
								? user.metadata.profile_picture
								: undefined
						}
						backupImage={themeSprings.theme.to((theme) =>
							theme.endsWith('dark')
								? '/assets/svg/default-profile-icon-light.svg'
								: '/assets/svg/default-profile-icon.svg'
						)}
						width="2.5rem"
						height="2.5rem"
					/>
				</animated.a>
			)}
			<ThemeButton themeSprings={themeSprings} setTheme={setTheme} />
			{isDropdownOpen === true && !isMobile && (
				<DropdownContainer
					themeSprings={themeSprings}
					spring={loginDropdownSpring}
					springApi={loginDropdownApi}
					onClose={closeDropdown}
					ignoredElements={[userButtonRef]}
				>
					<AuthContainer themeSprings={themeSprings} />
				</DropdownContainer>
			)}
			{isDropdownOpen === true && isMobile && (
				<Modal
					style={{
						backgroundColor: themeSprings.themeSecondary,
						borderRadius: '0.5rem'
					}}
					isOpen={isDropdownOpen}
					onClose={() => {
						setIsDropdownOpen(false);
					}}
				>
					<AuthContainer themeSprings={themeSprings} />
				</Modal>
			)}
		</div>
	);
};
