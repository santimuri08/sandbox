import { animated } from '@react-spring/web';
import {
	FaBook,
	FaRocket,
	FaCubes,
	FaLayerGroup,
	FaServer,
	FaDatabase,
	FaBolt,
	FaCloudUploadAlt,
	FaCode,
	FaPuzzlePiece
} from 'react-icons/fa';
import { MenuItem } from '../../types/types';
import { Overview } from '../components/documentation/overview/OverviewView';
import { AbsoluteAuthView } from '../components/documentation/packages/AbsoluteAuthView';
import { CitraView } from '../components/documentation/packages/CitraView';
import { CreateAbsoluteJSView } from '../components/documentation/packages/CreateAbsoluteJSView';
import { EslintView } from '../components/documentation/packages/eslint/EslintView';

const definePortalViews = <T>(views: T) => views;

export const docsViews = definePortalViews({
	'absolute-auth': AbsoluteAuthView,
	angular: Overview,
	'api-build': Overview,
	assets: Overview,
	'build-and-manifest': Overview,
	citra: CitraView,
	'create-absolutejs': CreateAbsoluteJSView,
	'data-fetching': Overview,
	docker: Overview,
	'elysia-integration': Overview,
	'error-handling': Overview,
	eslint: EslintView,
	hosting: Overview,
	html: Overview,
	htmx: Overview,
	installation: Overview,
	overview: Overview,
	'page-handlers': Overview,
	plugin: Overview,
	'production-build': Overview,
	quickstart: Overview,
	react: Overview,
	'routing-and-handlers': Overview,
	'server state': Overview,
	'ssr-model': Overview,
	svelte: Overview,
	types: Overview,
	vue: Overview
});

export const sidebarData: MenuItem[] = [
	{
		icon: animated(FaBook),
		id: 'overview',
		label: 'Overview'
	},
	{
		buttons: [
			{ id: 'installation', label: 'Installation' },
			{ id: 'quickstart', label: 'Quickstart' }
		],
		icon: animated(FaRocket),
		label: 'Getting Started'
	},
	{
		buttons: [
			{ id: 'ssr-model', label: 'SSR Model' },
			{ id: 'build-and-manifest', label: 'Build & Manifest' },
			{ id: 'routing-and-handlers', label: 'Routing & Handlers' }
		],
		icon: animated(FaLayerGroup),
		label: 'Core Concepts'
	},
	{
		buttons: [
			{ id: 'react', label: 'React' },
			{ id: 'svelte', label: 'Svelte' },
			{ id: 'html', label: 'HTML' },
			{ id: 'htmx', label: 'HTMX' },
			{ id: 'vue', label: 'Vue' },
			{ id: 'angular', label: 'Angular' }
		],
		icon: animated(FaCubes),
		label: 'Frontends'
	},
	{
		buttons: [
			{ id: 'elysia-integration', label: 'Elysia Integration' },
			{ id: 'plugin', label: 'Plugin' }
		],
		icon: animated(FaServer),
		label: 'Server'
	},
	{
		buttons: [
			{ id: 'absolute-auth', label: 'Absolute Auth' },
			{ id: 'citra', label: 'Citra' },
			{ id: 'create-absolutejs', label: 'Create AbsoluteJS' },
			{ id: 'eslint', label: 'ESLint' }
		],
		icon: animated(FaPuzzlePiece),
		label: 'Plugins'
	},
	{
		buttons: [
			{ id: 'data-fetching', label: 'Data Fetching' },
			{ id: 'server state', label: 'Server State' }
		],
		icon: animated(FaDatabase),
		label: 'Data & State'
	},
	{
		buttons: [{ id: 'assets', label: 'Assets' }],
		icon: animated(FaBolt),
		label: 'Assets & Performance'
	},
	{
		buttons: [
			{ id: 'production-build', label: 'Production Build' },
			{ id: 'hosting', label: 'Hosting' },
			{ id: 'docker', label: 'Docker' }
		],
		icon: animated(FaCloudUploadAlt),
		label: 'Deployment'
	},
	{
		buttons: [
			{ id: 'api-build', label: 'API: build()' },
			{ id: 'page-handlers', label: 'Page Handlers' },
			{ id: 'types', label: 'Types' }
		],
		icon: animated(FaCode),
		label: 'Reference'
	}
];
