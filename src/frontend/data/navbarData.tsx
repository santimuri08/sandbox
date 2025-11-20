import { NavbarElement } from '../../types/types';

export const navbarData: NavbarElement[] = [
	{
		href: '/documentation',
		label: 'Documentation'
	},
	{
		href: '/documentation/packages',
		label: 'Packages',
		links: [
			{
				href: '/documentation/packages/auth',
				label: 'Auth'
			},
			{
				href: '/documentation/packages/citra',
				label: 'Citra'
			},
			{
				href: '/documentation/packages/create',
				label: 'Create'
			},
			{
				href: '/documentation/packages/eslint',
				label: 'Eslint'
			}
		]
	},
	{
		href: '/testing',
		label: 'Testing',
		links: [
			{
				href: '/testing/authentication',
				label: 'Authentication'
			}
		]
	}
];
