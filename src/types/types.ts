import { AnimatedComponent } from '@react-spring/web';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { DatabaseType } from '../../db/schema';
import { docsViews } from '../frontend/data/sidebarData';

export type NavbarLink = {
	href: string;
	label: string;
	icon?: ReactNode;
};

type NavbarDropdown = {
	label: string;
	href: string;
	links: NavbarLink[];
	icon?: ReactNode;
};

export const isNavbarDropdown = (
	element: NavbarElement
): element is NavbarDropdown => 'links' in element;

export type NavbarElement = NavbarLink | NavbarDropdown;

export type MenuDropdown = {
	label: string;
	buttons: MenuButton[];
	icon: AnimatedComponent<IconType>;
};

export type MenuButton = {
	id: DocsView;
	label: string;
	icon?: AnimatedComponent<IconType>;
	// view: LazyExoticComponent<ComponentType<null>>;
};

export type MenuItem = MenuDropdown | MenuButton;

export const isMenuDropdown = (element: MenuItem): element is MenuDropdown =>
	'buttons' in element;

export type DocsView = keyof typeof docsViews;

export type UserFunctionProps = {
	authProvider: string;
	userIdentity: Record<string, unknown>;
	db: DatabaseType;
};
