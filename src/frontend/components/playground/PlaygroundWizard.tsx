import { animated } from '@react-spring/web';
import { useState, type ChangeEvent } from 'react';
import type { ThemeProps } from '../../../types/springTypes';
import type { PlaygroundConfig } from './PlaygroundPage';
import { PrismPlus} from '../utils/PrismPlus'

interface PlaygroundWizardProps extends ThemeProps {
	onGenerate: (config: PlaygroundConfig) => void;
}

type DatabaseEngine = 'none' | 'postgresql' | 'sqlite' | 'mysql' | 'mariadb' | 'gel' | 'mongodb' | 'singlestore' | 'cockroachdb' | 'mssql';
type DatabaseHost = 'none' | 'neon' | 'planetscale' | 'turso';
type ORM = 'drizzle' | 'prisma';
type CodeQualityTool = 'eslint+prettier' | 'biome';
type ConfigurationType = 'default' | 'custom';
type AuthProvider = 'none' | 'absoluteAuth';
type PluginType = '@elysiajs/cors' | '@elysiajs/swagger' | 'elysia-rate-limit';

type SelectOption = {
	label: string;
	value: string;
};

type PluginOption = {
	description: string;
	label: string;
	value: string;
};

type StyleObject = Record<string, string | number>;

type StepHeaderProps = {
	description: string;
	title: string;
};

type OptionCardProps = {
	disabled?: boolean;
	label: string;
	onClick: () => void;
	selected: boolean;
	subtitle?: string;
};

type ConfigRowProps = {
	label: string;
	rowValue: string;
};

type ProjectNameStepProps = {
	error: string;
	onNameChange: (name: string) => void;
	onValidate: (name: string) => boolean;
	projectName: string;
};

type CodeQualityStepProps = {
	onToolChange: (tool: CodeQualityTool) => void;
	selectedTool: CodeQualityTool;
};

type TailwindStepProps = {
	onTailwindChange: (enabled: boolean) => void;
	tailwindEnabled: boolean;
};

type FrontendsStepProps = {
	onFrontendsChange: (frontends: string[]) => void;
	selectedFrontends: string[];
};

type HtmlScriptsStepProps = {
	htmlScriptsEnabled: boolean;
	onHtmlScriptsChange: (enabled: boolean) => void;
};

type DatabaseStepProps = {
	onDatabaseChange: (database: DatabaseEngine) => void;
	selectedDatabase: DatabaseEngine;
};

type DatabaseHostOptionProps = {
	database: DatabaseEngine;
	hostOption: SelectOption;
	onHostChange: (host: DatabaseHost) => void;
	selectedHost: DatabaseHost;
};

type DatabaseHostStepProps = {
	database: DatabaseEngine;
	onHostChange: (host: DatabaseHost) => void;
	selectedHost: DatabaseHost;
};

type OrmStepProps = {
	onOrmChange: (ormValue: ORM) => void;
	selectedOrm: ORM;
};

type FolderStructureStepProps = {
	onConfigChange: (config: ConfigurationType) => void;
	selectedConfig: ConfigurationType;
};

type AuthenticationStepProps = {
	onAuthChange: (auth: AuthProvider) => void;
	selectedAuth: AuthProvider;
};

type PluginsStepProps = {
	onPluginsChange: (plugins: PluginType[]) => void;
	selectedPlugins: PluginType[];
};

type ReviewStepProps = {
	authProvider: AuthProvider;
	codeQualityTool: CodeQualityTool;
	configurationType: ConfigurationType;
	databaseEngine: DatabaseEngine;
	databaseHost: DatabaseHost;
	frontends: string[];
	orm: ORM;
	projectName: string;
	selectedPlugins: PluginType[];
	useHtmlScripts: boolean;
	useTailwind: boolean;
};

const DISABLED_OPACITY = 0.5;
const PROGRESS_MULTIPLIER = 100;

const FRONTEND_OPTIONS: SelectOption[] = [
	{ label: 'React', value: 'react' },
	{ label: 'Vue', value: 'vue' },
	{ label: 'Svelte', value: 'svelte' },
	{ label: 'Angular', value: 'angular' },
	{ label: 'HTMX', value: 'htmx' },
	{ label: 'HTML', value: 'html' }
];

const DATABASE_OPTIONS: SelectOption[] = [
	{ label: 'None', value: 'none' },
	{ label: 'PostgreSQL', value: 'postgresql' },
	{ label: 'MySQL', value: 'mysql' },
	{ label: 'SQLite', value: 'sqlite' },
	{ label: 'MariaDB', value: 'mariadb' },
	{ label: 'MongoDB', value: 'mongodb' },
	{ label: 'Gel', value: 'gel' },
	{ label: 'SingleStore', value: 'singlestore' },
	{ label: 'CockroachDB', value: 'cockroachdb' },
	{ label: 'MS SQL', value: 'mssql' }
];

const HOST_OPTIONS: SelectOption[] = [
	{ label: 'Neon', value: 'neon' },
	{ label: 'PlanetScale', value: 'planetscale' },
	{ label: 'Turso', value: 'turso' },
	{ label: 'Local', value: 'none' }
];

const WORKING_COMBINATIONS: Record<string, string[]> = {
	cockroachdb: [],
	gel: [],
	mariadb: [],
	mongodb: [],
	mssql: [],
	mysql: [],
	postgresql: ['neon'],
	singlestore: [],
	sqlite: ['turso', 'none']
};

const DATABASES_REQUIRING_DOCKER = [
	'postgresql', 'mysql', 'mariadb', 'mongodb',
	'gel', 'singlestore', 'cockroachdb', 'mssql'
];

const DATABASES_WITH_ORM = ['postgresql', 'sqlite', 'mysql', 'mariadb', 'singlestore', 'cockroachdb', 'mssql'];

const ORM_OPTIONS: SelectOption[] = [
	{ label: 'Drizzle', value: 'drizzle' },
	{ label: 'Prisma', value: 'prisma' }
];

const PLUGIN_OPTIONS: PluginOption[] = [
	{ description: 'Cross-Origin Resource Sharing', label: 'CORS', value: '@elysiajs/cors' },
	{ description: 'API documentation', label: 'Swagger', value: '@elysiajs/swagger' },
	{ description: 'Request rate limiting', label: 'Rate Limit', value: 'elysia-rate-limit' }
];

const cardStyle: StyleObject = {
	backgroundColor: 'rgba(30, 30, 30, 0.8)',
	border: '1px solid rgba(255, 255, 255, 0.1)',
	borderRadius: '12px',
	marginTop: '2rem',
	padding: '2rem'
};

const createButtonStyle = (primary: boolean) => {
	const baseStyle: StyleObject = {
		borderRadius: '8px',
		color: '#fff',
		cursor: 'pointer',
		fontSize: '1rem',
		fontWeight: 500,
		padding: '0.75rem 1.5rem',
		transition: 'all 0.2s ease'
	};

	if (primary) {
		return {
			...baseStyle,
			backgroundColor: '#3b82f6',
			border: 'none'
		};
	}

	return {
		...baseStyle,
		backgroundColor: 'transparent',
		border: '1px solid rgba(255, 255, 255, 0.2)'
	};
};

const disabledButtonStyle: StyleObject = {
	...createButtonStyle(true),
	backgroundColor: 'rgba(59, 130, 246, 0.3)',
	cursor: 'not-allowed'
};

const inputStyle: StyleObject = {
	backgroundColor: 'rgba(0, 0, 0, 0.3)',
	border: '1px solid rgba(255, 255, 255, 0.2)',
	borderRadius: '8px',
	color: '#fff',
	fontSize: '1rem',
	outline: 'none',
	padding: '0.75rem 1rem',
	width: '100%'
};

const createOptionCardStyle = (selected: boolean, disabled = false) => {
	const style: StyleObject = {
		backgroundColor: selected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.2)',
		border: `2px solid ${selected ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
		borderRadius: '8px',
		cursor: disabled ? 'not-allowed' : 'pointer',
		opacity: disabled ? DISABLED_OPACITY : 1,
		padding: '1rem',
		position: 'relative' as const,
		transition: 'all 0.2s ease'
	};

	return style;
};

const dockerWarningStyle: StyleObject = {
	alignItems: 'center',
	color: '#f59e0b',
	display: 'flex',
	fontSize: '0.75rem',
	gap: '0.25rem',
	marginTop: '0.5rem'
};

const hasHtmlFrontend = (frontends: string[]) => frontends.includes('html');

const supportsOrm = (database: DatabaseEngine) => DATABASES_WITH_ORM.includes(database);

const requiresDockerForLocal = (database: DatabaseEngine) => DATABASES_REQUIRING_DOCKER.includes(database);

const isHostWorkingForDatabase = (database: DatabaseEngine, host: string) => {
	const workingHosts = WORKING_COMBINATIONS[database] || [];

	return workingHosts.includes(host);
};


const getDefaultHostForDatabase = (database: DatabaseEngine) => {
	const workingHosts = WORKING_COMBINATIONS[database] || [];

	if (workingHosts.length > 0) {
		return workingHosts[0] as DatabaseHost;
	}

	return 'neon' as DatabaseHost;
};

const addDatabaseFlags = (
	parts: string[],
	databaseEngine: DatabaseEngine,
	databaseHost: DatabaseHost,
	orm: ORM
) => {
	if (databaseEngine === 'none') {
		return;
	}

	parts.push(`--db ${databaseEngine}`);

	const shouldAddDbHost = databaseHost && databaseHost !== 'none';
	const shouldAddOrm = supportsOrm(databaseEngine) && orm;

	if (shouldAddDbHost) {
		parts.push(`--db-host ${databaseHost}`);
	}

	if (shouldAddOrm) {
		parts.push(`--orm ${orm}`);
	}
};

const buildCliCommand = (
	projectName: string,
	codeQualityTool: CodeQualityTool,
	useTailwind: boolean,
	frontends: string[],
	useHtmlScripts: boolean,
	databaseEngine: DatabaseEngine,
	databaseHost: DatabaseHost,
	orm: ORM,
	configurationType: ConfigurationType,
	authProvider: AuthProvider,
	selectedPlugins: PluginType[]
) => {
	const parts = ['bun create absolutejs', projectName, '--skip'];

	if (codeQualityTool === 'biome') {
		parts.push('--biome');
	} else {
		parts.push('--eslint+prettier');
	}

	if (useTailwind) {
		parts.push('--tailwind');
	}

	frontends.forEach((frontend) => parts.push(`--${frontend}`));

	const shouldAddHtmlScripts = hasHtmlFrontend(frontends) && useHtmlScripts;

	if (shouldAddHtmlScripts) {
		parts.push('--html-scripts');
	}

	addDatabaseFlags(parts, databaseEngine, databaseHost, orm);

	parts.push(`--directory ${configurationType}`);

	if (authProvider !== 'none') {
		parts.push(`--auth ${authProvider}`);
	}

	selectedPlugins.forEach((plugin) => parts.push(`--plugin ${plugin}`));
	parts.push('--install');

	return parts.join(' ');
};

const StepHeader = ({ description, title }: StepHeaderProps) => (
	<header style={{ marginBottom: '1.5rem' }}>
		<h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
			{title}
		</h2>
		<p style={{ color: 'rgba(255,255,255,0.6)' }}>
			{description}
		</p>
	</header>
);

const OptionCard = ({ disabled = false, label, onClick, selected, subtitle }: OptionCardProps) => (
	<article
		onClick={disabled ? undefined : onClick}
		style={createOptionCardStyle(selected, disabled)}
	>
		<p style={{ color: '#fff', fontWeight: 600 }}>{label}</p>
		{subtitle && (
			<p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
				{subtitle}
			</p>
		)}
	</article>
);


const ConfigRow = ({ label, rowValue }: ConfigRowProps) => (
	<p style={{ marginBottom: '0.75rem' }}>
		<span style={{ color: 'rgba(255,255,255,0.6)' }}>{label}:</span>{' '}
		<span style={{ color: '#fff' }}>{rowValue}</span>
	</p>
);

const ProjectNameStep = ({ error, onNameChange, onValidate, projectName }: ProjectNameStepProps) => {
	const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
		const newName = evt.target.value;
		onNameChange(newName);
		onValidate(newName);
	};

	return (
		<section>
			<StepHeader
				description={''}
				title="Project Name"
			/>
			<input
				onChange={handleChange}
				placeholder="my-app"
				style={inputStyle}
				type="text"
				value={projectName}
			/>
			{error && (
				<p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
					{error}
				</p>
			)}
		</section>
	);
};

const CodeQualityStep = ({ onToolChange, selectedTool }: CodeQualityStepProps) => (
	<section>
		<StepHeader
			description={''}
			title="Code Quality Tool"
		/>
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<OptionCard
				label="ESLint + Prettier"
				onClick={() => onToolChange('eslint+prettier')}
				selected={selectedTool === 'eslint+prettier'}
				subtitle={''}
			/>
			<OptionCard
				label="Biome"
				onClick={() => onToolChange('biome')}
				selected={selectedTool === 'biome'}
				subtitle={''}
			/>
		</nav>
	</section>
);

const TailwindStep = ({ onTailwindChange, tailwindEnabled }: TailwindStepProps) => (
	<section>
		<StepHeader
			description={''}
			title="Tailwind CSS"
		/>
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<OptionCard
				label="Yes, include Tailwind"
				onClick={() => onTailwindChange(true)}
				selected={tailwindEnabled}
				subtitle={''}
			/>
			<OptionCard
				label="No, skip Tailwind"
				onClick={() => onTailwindChange(false)}
				selected={!tailwindEnabled}
				subtitle={''}
			/>
		</nav>
	</section>
);

const FrontendsStep = ({ onFrontendsChange, selectedFrontends }: FrontendsStepProps) => {
	const toggleFrontend = (frontend: string) => {
		if (selectedFrontends.includes(frontend)) {
			onFrontendsChange(selectedFrontends.filter((item) => item !== frontend));
		} else {
			onFrontendsChange([...selectedFrontends, frontend]);
		}
	};

	return (
		<section>
			<StepHeader
				description={''}
				title="Frontend Frameworks"
			/>
			<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
				{FRONTEND_OPTIONS.map((option) => (
					<OptionCard
						key={option.value}
						label={option.label}
						onClick={() => toggleFrontend(option.value)}
						selected={selectedFrontends.includes(option.value)}
					/>
				))}
			</nav>
			{selectedFrontends.length === 0 && (
				<p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem' }}>
					Please select at least one frontend framework
				</p>
			)}
		</section>
	);
};

const HtmlScriptsStep = ({ htmlScriptsEnabled, onHtmlScriptsChange }: HtmlScriptsStepProps) => (
	<section>
		<StepHeader
			description={''}
			title="HTML Scripting"
		/>
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<OptionCard
				label={''}
				onClick={() => onHtmlScriptsChange(true)}
				selected={htmlScriptsEnabled}
				subtitle="Use TypeScript in your HTML pages"
			/>
			<OptionCard
                onClick={() => onHtmlScriptsChange(false)}
                selected={!htmlScriptsEnabled}
                subtitle="Static HTML without scripting" label={''}			/>
		</nav>
	</section>
);

const DatabaseStep = ({ onDatabaseChange, selectedDatabase }: DatabaseStepProps) => (
	<section>
		<StepHeader
			description={''}
			title="Database Engine"
		/>
		<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
			{DATABASE_OPTIONS.map((option) => (
				<OptionCard
					key={option.value}
					label={option.label}
					onClick={() => onDatabaseChange(option.value as DatabaseEngine)}
					selected={selectedDatabase === option.value}
				/>
			))}
		</nav>
	</section>
);

const DatabaseHostOption = ({ database, hostOption, onHostChange, selectedHost }: DatabaseHostOptionProps) => {
	const isWorking = isHostWorkingForDatabase(database, hostOption.value);
	const isSelected = selectedHost === hostOption.value;
	const isLocalOption = hostOption.value === 'none';
	const showDockerWarning = isLocalOption && requiresDockerForLocal(database);

	return (
		<article
			onClick={() => onHostChange(hostOption.value as DatabaseHost)}
			style={createOptionCardStyle(isSelected, !isWorking)}
		>
			<p style={{ color: '#fff', fontWeight: 600 }}>{hostOption.label}</p>
			{showDockerWarning && (
				<p style={dockerWarningStyle}>
					<span>Local Docker databases cannot be used in the trial</span>
				</p>
			)}
			{!isWorking && !isLocalOption && (
				<p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
					Not available for {database} yet
				</p>
			)}
		</article>
	);
};

const DatabaseHostStep = ({ database, onHostChange, selectedHost }: DatabaseHostStepProps) => (
		<section>
			<StepHeader
				description={`Choose where to host your ${database} database`}
				title="Database Host"
			/>

			<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
				{HOST_OPTIONS.map((option) => (
					<DatabaseHostOption
						database={database}
						hostOption={option}
						key={option.value}
						onHostChange={onHostChange}
						selectedHost={selectedHost}
					/>
				))}
			</nav>
			<p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '1rem' }}>
				Grayed out options are not yet available in the playground.
				Download your project to use all hosting options locally.
			</p>
		</section>
	);

const OrmStep = ({ onOrmChange, selectedOrm }: OrmStepProps) => (
	<section>
		<StepHeader
			description={''}
			title="ORM Selection"
		/>
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			{ORM_OPTIONS.map((option) => (
				<OptionCard
					key={option.value}
					label={option.label}
					onClick={() => onOrmChange(option.value as ORM)}
					selected={selectedOrm === option.value}
				/>
			))}
		</nav>
	</section>
);

const FolderStructureStep = ({ onConfigChange, selectedConfig }: FolderStructureStepProps) => (
	<section>
		<StepHeader
			description={''}
			title="Folder Configuration"
		/>
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<OptionCard
				label="Default"
				onClick={() => onConfigChange('default')}
				selected={selectedConfig === 'default'}
				subtitle="Standard AbsoluteJS structure"
			/>
			<OptionCard
				label="Custom"
				onClick={() => onConfigChange('custom')}
				selected={selectedConfig === 'custom'}
				subtitle="Customize folder layout"
			/>
		</nav>
	</section>
);

const AuthenticationStep = ({ onAuthChange, selectedAuth }: AuthenticationStepProps) => (
	<section>
		<StepHeader
            title="Authentication" description={''}		/>
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<OptionCard
				label="No Authentication"
				onClick={() => onAuthChange('none')}
				selected={selectedAuth === 'none'}
				subtitle="Skip authentication setup"
			/>
			<OptionCard
				label="Absolute Auth"
				onClick={() => onAuthChange('absoluteAuth')}
				selected={selectedAuth === 'absoluteAuth'}
				subtitle="Built-in authentication system"
			/>
		</nav>
	</section>
);

const PluginsStep = ({ onPluginsChange, selectedPlugins }: PluginsStepProps) => {
	const togglePlugin = (plugin: PluginType) => {
		if (selectedPlugins.includes(plugin)) {
			onPluginsChange(selectedPlugins.filter((item) => item !== plugin));
		} else {
			onPluginsChange([...selectedPlugins, plugin]);
		}
	};

	return (
		<section>
			<StepHeader
				description="Select plugins"
				title="Plugins"
			/>
			<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
				{PLUGIN_OPTIONS.map((option) => (
					<OptionCard
						key={option.value}
						label={option.label}
						onClick={() => togglePlugin(option.value as PluginType)}
						selected={selectedPlugins.includes(option.value as PluginType)}
						subtitle={option.description}
					/>
				))}
			</nav>
			<p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '1rem' }}>
				You can skip this step if you don&apos;t need any plugins
			</p>
		</section>
	);
};

const ReviewStep = ({
	authProvider,
	codeQualityTool,
	configurationType,
	databaseEngine,
	databaseHost,
	frontends,
	orm,
	projectName,
	selectedPlugins,
	useHtmlScripts,
	useTailwind
}: ReviewStepProps) => {
	const showHtmlScripts = hasHtmlFrontend(frontends);
	const showOrm = databaseEngine !== 'none' && supportsOrm(databaseEngine);
	const cliPreview = buildCliCommand(
		projectName,
		codeQualityTool,
		useTailwind,
		frontends,
		useHtmlScripts,
		databaseEngine,
		databaseHost,
		orm,
		configurationType,
		authProvider,
		selectedPlugins
	);

	const getDatabaseHostDisplay = () => {
		if (databaseHost === 'none') {
			return 'Local ';
		}

		return databaseHost;
	};

	const getPluginsDisplay = () => {
		if (selectedPlugins.length > 0) {
			return selectedPlugins.join(', ');
		}

		return 'None';
	};

	return (
		<section>
			<StepHeader
				description="Review"
				title="Review Configuration"
			/>
			<article style={{
				backgroundColor: 'rgba(0,0,0,0.3)',
				borderRadius: '8px',
				fontFamily: 'monospace',
				padding: '1.5rem'
			}}>
				<ConfigRow label="Project Name" rowValue={projectName} />
				<ConfigRow label="Code Quality" rowValue={codeQualityTool} />
				<ConfigRow label="Tailwind" rowValue={useTailwind ? 'Yes' : 'No'} />
				<ConfigRow label="Frontends" rowValue={frontends.join(', ')} />
				{showHtmlScripts && (
					<ConfigRow label="HTML Scripts" rowValue={useHtmlScripts ? 'Yes' : 'No'} />
				)}
				<ConfigRow label="Database" rowValue={databaseEngine === 'none' ? 'None' : databaseEngine} />
				{databaseEngine !== 'none' && (
					<ConfigRow label="Database Host" rowValue={getDatabaseHostDisplay()} />
				)}
				{showOrm && (
					<ConfigRow label="ORM" rowValue={orm} />
				)}
				<ConfigRow label="Folder Structure" rowValue={configurationType} />
				<ConfigRow label="Authentication" rowValue={authProvider === 'none' ? 'None' : 'Absolute Auth'} />
				<ConfigRow label="Plugins" rowValue={getPluginsDisplay()} />
				<ConfigRow label="Package Manager" rowValue="Bun" />
			</article>
			<article style={{ marginTop: '1.5rem' }}>
				<p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
					CLI Command:
				</p>
				<p style={{
					backgroundColor: 'rgba(0,0,0,0.5)',
					borderRadius: '8px',
					color: '#10b981',
					fontFamily: 'monospace',
					fontSize: '0.875rem',
					overflowX: 'auto',
					padding: '1rem',
					whiteSpace: 'pre-wrap',
					wordBreak: 'break-all'
				}}>
					{cliPreview}
				</p>
			</article>
			<aside style={{
				backgroundColor: 'rgba(59, 130, 246, 0.1)',
				border: '1px solid rgba(59, 130, 246, 0.2)',
				borderRadius: '8px',
				marginTop: '1rem',
				padding: '0.75rem 1rem'
			}}>
				<p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', margin: 0 }}>
					Dependencies will be installed automatically.
				</p>
			</aside>
		</section>
	);
};

export const PlaygroundWizard = ({ onGenerate }: PlaygroundWizardProps) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [projectName, setProjectName] = useState('my-app');
	const [codeQualityTool, setCodeQualityTool] = useState<CodeQualityTool>('eslint+prettier');
	const [useTailwind, setUseTailwind] = useState(true);
	const [frontends, setFrontends] = useState<string[]>(['react']);
	const [useHtmlScripts, setUseHtmlScripts] = useState(false);
	const [databaseEngine, setDatabaseEngine] = useState<DatabaseEngine>('none');
	const [databaseHost, setDatabaseHost] = useState<DatabaseHost>('none');
	const [orm, setOrm] = useState<ORM>('drizzle');
	const [configurationType, setConfigurationType] = useState<ConfigurationType>('default');
	const [authProvider, setAuthProvider] = useState<AuthProvider>('none');
	const [selectedPlugins, setSelectedPlugins] = useState<PluginType[]>([]);
	const [nameError, setNameError] = useState<string>('');

	const getSteps = () => {
		const stepList = [
			'Project Name',
			'Code Quality',
			'Tailwind CSS',
			'Frontend Frameworks'
		];

		if (hasHtmlFrontend(frontends)) {
			stepList.push('HTML Scripts');
		}

		stepList.push('Database');

		if (databaseEngine !== 'none') {
			stepList.push('Database Host');
		}

		if (databaseEngine !== 'none' && supportsOrm(databaseEngine)) {
			stepList.push('ORM');
		}

		stepList.push('Folder Structure');
		stepList.push('Authentication');
		stepList.push('Plugins');
		stepList.push('Review');

		return stepList;
	};

	const steps = getSteps();
	const totalSteps = steps.length;

	const validateProjectName = (name: string) => {
		if (!name || name.trim() === '') {
			setNameError('Project name is required');

			return false;
		}

		if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
			setNameError('Only letters, numbers, dashes, and underscores allowed');

			return false;
		}

		setNameError('');

		return true;
	};

	const canProceed = () => {
		const stepName = steps[currentStep];

		switch (stepName) {
			case 'Project Name':
				return projectName.length > 0 && !nameError;
			case 'Frontend Frameworks':
				return frontends.length > 0;
			case 'Database Host':
				return isHostWorkingForDatabase(databaseEngine, databaseHost);
			default:
				return true;
		}
	};

	const handleNext = () => {
		const stepName = steps[currentStep];

		if (stepName === 'Project Name' && !validateProjectName(projectName)) {
			return;
		}

		if (stepName === 'Database') {
			setDatabaseHost(getDefaultHostForDatabase(databaseEngine));
		}

		if (stepName === 'Frontend Frameworks' && !frontends.includes('html')) {
			setUseHtmlScripts(false);
		}

		if (currentStep < totalSteps - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleGenerate = () => {
		const config: PlaygroundConfig = {
			authProvider,
			codeQualityTool,
			configurationType,
			databaseEngine,
			databaseHost: databaseEngine !== 'none' ? databaseHost : undefined,
			frontends,
			gitInit: false,
			installDeps: true,
			orm: databaseEngine !== 'none' && supportsOrm(databaseEngine) ? orm : undefined,
			projectName,
			selectedPlugins,
			useHtmlScripts: hasHtmlFrontend(frontends) ? useHtmlScripts : false,
			useTailwind
		};

		onGenerate(config);
	};

	const renderStep = () => {
		const stepName = steps[currentStep];

		switch (stepName) {
			case 'Project Name':
				return (
					<ProjectNameStep
						error={nameError}
						onNameChange={setProjectName}
						onValidate={validateProjectName}
						projectName={projectName}
					/>
				);
			case 'Code Quality':
				return (
					<CodeQualityStep
						onToolChange={setCodeQualityTool}
						selectedTool={codeQualityTool}
					/>
				);
			case 'Tailwind CSS':
				return (
					<TailwindStep
						onTailwindChange={setUseTailwind}
						tailwindEnabled={useTailwind}
					/>
				);
			case 'Frontend Frameworks':
				return (
					<FrontendsStep
						onFrontendsChange={setFrontends}
						selectedFrontends={frontends}
					/>
				);
			case 'HTML Scripts':
				return (
					<HtmlScriptsStep
						htmlScriptsEnabled={useHtmlScripts}
						onHtmlScriptsChange={setUseHtmlScripts}
					/>
				);
			case 'Database':
				return (
					<DatabaseStep
						onDatabaseChange={setDatabaseEngine}
						selectedDatabase={databaseEngine}
					/>
				);
			case 'Database Host':
				return (
					<DatabaseHostStep
						database={databaseEngine}
						onHostChange={setDatabaseHost}
						selectedHost={databaseHost}
					/>
				);
			case 'ORM':
				return (
					<OrmStep
						onOrmChange={setOrm}
						selectedOrm={orm}
					/>
				);
			case 'Folder Structure':
				return (
					<FolderStructureStep
						onConfigChange={setConfigurationType}
						selectedConfig={configurationType}
					/>
				);
			case 'Authentication':
				return (
					<AuthenticationStep
						onAuthChange={setAuthProvider}
						selectedAuth={authProvider}
					/>
				);
			case 'Plugins':
				return (
					<PluginsStep
						onPluginsChange={setSelectedPlugins}
						selectedPlugins={selectedPlugins}
					/>
				);
			case 'Review':
				return (
					<ReviewStep
						authProvider={authProvider}
						codeQualityTool={codeQualityTool}
						configurationType={configurationType}
						databaseEngine={databaseEngine}
						databaseHost={databaseHost}
						frontends={frontends}
						orm={orm}
						projectName={projectName}
						selectedPlugins={selectedPlugins}
						useHtmlScripts={useHtmlScripts}
						useTailwind={useTailwind}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<animated.div style={cardStyle}>
			<header style={{ marginBottom: '2rem' }}>
				<nav style={{
					alignItems: 'center',
					display: 'flex',
					justifyContent: 'space-between',
					marginBottom: '0.5rem'
				}}>
					<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
						Step {currentStep + 1} of {totalSteps}
					</span>
					<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
						{steps[currentStep]}
					</span>
				</nav>
				<section style={{
					backgroundColor: 'rgba(255,255,255,0.1)',
					borderRadius: '2px',
					height: '4px',
					overflow: 'hidden'
				}}>
					<span style={{
						backgroundColor: '#3b82f6',
						display: 'block',
						height: '100%',
						transition: 'width 0.3s ease',
						width: `${((currentStep + 1) / totalSteps) * PROGRESS_MULTIPLIER}%`
					}} />
				</section>
			</header>

			{renderStep()}

			<footer style={{
				borderTop: '1px solid rgba(255,255,255,0.1)',
				display: 'flex',
				justifyContent: 'space-between',
				marginTop: '2rem',
				paddingTop: '1.5rem'
			}}>
				<button
					disabled={currentStep === 0}
					onClick={handleBack}
					style={{
						...createButtonStyle(false),
						cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
						opacity: currentStep === 0 ? DISABLED_OPACITY : 1
					}}
					type="button"
				>
					Back
				</button>
				{steps[currentStep] === 'Review' ? (
					<button
						onClick={handleGenerate}
						style={createButtonStyle(true)}
						type="button"
					>
						Generate Project
					</button>
				) : (
					<button
						disabled={!canProceed()}
						onClick={handleNext}
						style={canProceed() ? createButtonStyle(true) : disabledButtonStyle}
						type="button"
					>
						Next
					</button>
				)}
			</footer>
		</animated.div>
	);
};
