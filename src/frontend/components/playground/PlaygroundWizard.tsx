import { animated } from '@react-spring/web';
import { useState, type ReactNode, type ChangeEvent } from 'react';
import type { ThemeProps } from '../../../types/springTypes';
import { PrismPlus } from '../utils/PrismPlus';
import type { PlaygroundConfig } from './PlaygroundPage';

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

interface LabelValue {
	label: string;
	value: string;
}

interface PluginOption extends LabelValue {
	description: string;
}

const FRONTEND_OPTIONS: LabelValue[] = [
	{ label: 'React', value: 'react' },
	{ label: 'Vue', value: 'vue' },
	{ label: 'Svelte', value: 'svelte' },
	{ label: 'Angular', value: 'angular' },
	{ label: 'HTMX', value: 'htmx' },
	{ label: 'HTML', value: 'html' }
];

const DATABASE_OPTIONS: LabelValue[] = [
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

const HOST_OPTIONS: LabelValue[] = [
	{ label: 'Neon', value: 'neon' },
	{ label: 'PlanetScale', value: 'planetscale' },
	{ label: 'Turso', value: 'turso' },
	{ label: 'Local', value: 'none' }
];

const ORM_OPTIONS: LabelValue[] = [
	{ label: 'Drizzle', value: 'drizzle' },
	{ label: 'Prisma', value: 'prisma' }
];

const PLUGIN_OPTIONS: PluginOption[] = [
	{ description: 'Cross-Origin Resource Sharing', label: 'CORS', value: '@elysiajs/cors' },
	{ description: 'API documentation', label: 'Swagger', value: '@elysiajs/swagger' },
	{ description: 'Request rate limiting', label: 'Rate Limit', value: 'elysia-rate-limit' }
];

const WORKING_HOSTS: Record<string, string[]> = {
	cockroachdb: [], gel: [], mariadb: [], mongodb: [], mssql: [], mysql: [], postgresql: ['neon'], singlestore: [], sqlite: ['turso', 'none']
};

const DATABASES_WITH_ORM = ['postgresql', 'sqlite', 'mysql', 'mariadb', 'singlestore', 'cockroachdb', 'mssql'];
const DOCKER_REQUIRED = ['postgresql', 'mysql', 'mariadb', 'mongodb', 'gel', 'singlestore', 'cockroachdb', 'mssql'];

const PROGRESS_PERCENT_MULTIPLIER = 100;
const BUTTON_OPACITY_DISABLED = 0.5;

const isHostWorking = (database: DatabaseEngine, host: string) => 
	(WORKING_HOSTS[database] || []).includes(host);

const getDefaultHost = (database: DatabaseEngine) => {
	const hosts = WORKING_HOSTS[database] || [];

	return (hosts[0] as DatabaseHost) || 'none';
};

const buildCliCommand = (
	projectName: string,
	codeQuality: CodeQualityTool,
	tailwind: boolean,
	frontends: string[],
	htmlScripts: boolean,
	database: DatabaseEngine,
	dbHost: DatabaseHost,
	orm: ORM,
	dirType: ConfigurationType,
	auth: AuthProvider,
	plugins: PluginType[]
) => {
	const parts = [`bun create absolutejs ${projectName}`, '--skip'];
	parts.push(codeQuality === 'biome' ? '--biome' : '--eslint+prettier');
	if (tailwind) parts.push('--tailwind');

	for (const frontend of frontends) parts.push(`--${frontend}`);
	if (frontends.includes('html') && htmlScripts) parts.push('--html-scripts');

	if (database !== 'none') {
		parts.push(`--db ${database}`);
		if (dbHost !== 'none') parts.push(`--db-host ${dbHost}`);
		if (DATABASES_WITH_ORM.includes(database)) parts.push(`--orm ${orm}`);
	}

	parts.push(`--directory ${dirType}`);
	if (auth !== 'none') parts.push(`--auth ${auth}`);
	for (const plugin of plugins) parts.push(`--plugin ${plugin}`);
	parts.push('--install');

	return parts.join(' ');
};

interface OptionCardProps {
	label: string;
	subtitle?: string;
	selected: boolean;
	disabled?: boolean;
	onClick: () => void;
}

const OptionCard = ({ label, subtitle, selected, disabled, onClick }: OptionCardProps) => (
	<article
		onClick={disabled ? undefined : onClick}
		style={{
			backgroundColor: selected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.2)',
			border: `2px solid ${selected ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
			borderRadius: '8px',
			cursor: disabled ? 'not-allowed' : 'pointer',
			opacity: disabled ? BUTTON_OPACITY_DISABLED : 1,
			padding: '1rem'
		}}
	>
		<p style={{ color: '#fff', fontWeight: 600 }}>{label}</p>
		{subtitle && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{subtitle}</p>}
	</article>
);

interface StepProps {
	title: string;
	children: ReactNode;
}

const StepContainer = ({ title, children }: StepProps) => (
	<section>
		<h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{title}</h2>
		{children}
	</section>
);

interface ProjectNameStepProps {
	projectName: string;
	nameError: string;
	onNameChange: (name: string) => void;
	onValidate: (name: string) => void;
}

const ProjectNameStep = ({ projectName, nameError, onNameChange, onValidate }: ProjectNameStepProps) => {
	const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
		const newName = evt.target.value;
		onNameChange(newName);
		onValidate(newName);
	};

	return (
		<StepContainer title="Project Name">
			<input
				value={projectName}
				onChange={handleChange}
				placeholder="my-app"
				style={{
					backgroundColor: 'rgba(0, 0, 0, 0.3)',
					border: '1px solid rgba(255, 255, 255, 0.2)',
					borderRadius: '8px',
					color: '#fff',
					fontSize: '1rem',
					outline: 'none',
					padding: '0.75rem 1rem',
					width: '100%'
				}}
			/>
			{nameError && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{nameError}</p>}
		</StepContainer>
	);
};

interface CodeQualityStepProps {
	codeQuality: CodeQualityTool;
	onSelect: (tool: CodeQualityTool) => void;
}

const CodeQualityStep = ({ codeQuality, onSelect }: CodeQualityStepProps) => (
	<StepContainer title="Code Quality Tool">
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<OptionCard label="ESLint + Prettier" selected={codeQuality === 'eslint+prettier'} onClick={() => onSelect('eslint+prettier')} />
			<OptionCard label="Biome" selected={codeQuality === 'biome'} onClick={() => onSelect('biome')} />
		</nav>
	</StepContainer>
);

interface TailwindStepProps {
	useTailwind: boolean;
	onSelect: (use: boolean) => void;
}

const TailwindStep = ({ useTailwind, onSelect }: TailwindStepProps) => (
	<StepContainer title="Tailwind CSS">
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<OptionCard label="Yes, include Tailwind" selected={useTailwind} onClick={() => onSelect(true)} />
			<OptionCard label="No, skip Tailwind" selected={!useTailwind} onClick={() => onSelect(false)} />
		</nav>
	</StepContainer>
);

interface FrontendStepProps {
	frontends: string[];
	onFrontendsChange: (frontends: string[]) => void;
}

const FrontendStep = ({ frontends, onFrontendsChange }: FrontendStepProps) => {
	const handleToggle = (frontend: string) => {
		if (frontends.includes(frontend)) {
			onFrontendsChange(frontends.filter((item) => item !== frontend));
		} else {
			onFrontendsChange([...frontends, frontend]);
		}
	};

	return (
		<StepContainer title="Frontend Frameworks">
			<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
				{FRONTEND_OPTIONS.map((opt) => (
					<OptionCard key={opt.value} label={opt.label} selected={frontends.includes(opt.value)} onClick={() => handleToggle(opt.value)} />
				))}
			</nav>
			{!frontends.length && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem' }}>Select at least one</p>}
		</StepContainer>
	);
};

interface HtmlScriptsStepProps {
	useHtmlScripts: boolean;
	onSelect: (use: boolean) => void;
}

const HtmlScriptsStep = ({ useHtmlScripts, onSelect }: HtmlScriptsStepProps) => (
	<StepContainer title="HTML Scripting">
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<OptionCard label="Yes, enable HTML scripts" subtitle="TypeScript in HTML" selected={useHtmlScripts} onClick={() => onSelect(true)} />
			<OptionCard label="No, plain HTML" subtitle="Static HTML only" selected={!useHtmlScripts} onClick={() => onSelect(false)} />
		</nav>
	</StepContainer>
);

interface DatabaseStepProps {
	database: DatabaseEngine;
	onSelect: (db: DatabaseEngine) => void;
}

const DatabaseStep = ({ database, onSelect }: DatabaseStepProps) => (
	<StepContainer title="Database Engine">
		<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
			{DATABASE_OPTIONS.map((opt) => (
				<OptionCard key={opt.value} label={opt.label} selected={database === opt.value} onClick={() => onSelect(opt.value as DatabaseEngine)} />
			))}
		</nav>
	</StepContainer>
);

interface HostOptionProps {
	opt: LabelValue;
	database: DatabaseEngine;
	dbHost: DatabaseHost;
	onSelect: (host: DatabaseHost) => void;
}

const HostOption = ({ opt, database, dbHost, onSelect }: HostOptionProps) => {
	const works = isHostWorking(database, opt.value);
	const isLocal = opt.value === 'none';
	const showDocker = isLocal && DOCKER_REQUIRED.includes(database);

	return (
		<article
			onClick={() => onSelect(opt.value as DatabaseHost)}
			style={{
				backgroundColor: dbHost === opt.value ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.2)',
				border: `2px solid ${dbHost === opt.value ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
				borderRadius: '8px',
				cursor: works ? 'pointer' : 'not-allowed',
				opacity: works ? 1 : BUTTON_OPACITY_DISABLED,
				padding: '1rem'
			}}
		>
			<p style={{ color: '#fff', fontWeight: 600 }}>{opt.label}</p>
			{showDocker && <p style={{ color: '#f59e0b', fontSize: '0.75rem', marginTop: '0.5rem' }}>Docker required, not available in trial</p>}
			{!works && !isLocal && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Not available for {database}</p>}
		</article>
	);
};

interface DatabaseHostStepProps {
	database: DatabaseEngine;
	dbHost: DatabaseHost;
	onSelect: (host: DatabaseHost) => void;
}

const DatabaseHostStep = ({ database, dbHost, onSelect }: DatabaseHostStepProps) => (
	<StepContainer title="Database Host">
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			{HOST_OPTIONS.map((opt) => (
				<HostOption key={opt.value} opt={opt} database={database} dbHost={dbHost} onSelect={onSelect} />
			))}
		</nav>
	</StepContainer>
);

interface OrmStepProps {
	orm: ORM;
	onSelect: (orm: ORM) => void;
}

const OrmStep = ({ orm, onSelect }: OrmStepProps) => (
	<StepContainer title="ORM Selection">
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			{ORM_OPTIONS.map((opt) => (
				<OptionCard key={opt.value} label={opt.label} selected={orm === opt.value} onClick={() => onSelect(opt.value as ORM)} />
			))}
		</nav>
	</StepContainer>
);

interface FolderStepProps {
	dirType: ConfigurationType;
	onSelect: (type: ConfigurationType) => void;
}

const FolderStep = ({ dirType, onSelect }: FolderStepProps) => (
	<StepContainer title="Folder Configuration">
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<OptionCard label="Default" subtitle="Standard AbsoluteJS structure" selected={dirType === 'default'} onClick={() => onSelect('default')} />
			<OptionCard label="Custom" subtitle="Customize folder layout" selected={dirType === 'custom'} onClick={() => onSelect('custom')} />
		</nav>
	</StepContainer>
);

interface AuthStepProps {
	auth: AuthProvider;
	onSelect: (auth: AuthProvider) => void;
}

const AuthStep = ({ auth, onSelect }: AuthStepProps) => (
	<StepContainer title="Authentication">
		<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<OptionCard label="No Authentication" subtitle="Skip auth setup" selected={auth === 'none'} onClick={() => onSelect('none')} />
			<OptionCard label="Absolute Auth" subtitle="Built-in auth system" selected={auth === 'absoluteAuth'} onClick={() => onSelect('absoluteAuth')} />
		</nav>
	</StepContainer>
);

interface PluginsStepProps {
	plugins: PluginType[];
	onPluginsChange: (plugins: PluginType[]) => void;
}

const PluginsStep = ({ plugins, onPluginsChange }: PluginsStepProps) => {
	const handleToggle = (plugin: PluginType) => {
		if (plugins.includes(plugin)) {
			onPluginsChange(plugins.filter((item) => item !== plugin));
		} else {
			onPluginsChange([...plugins, plugin]);
		}
	};

	return (
		<StepContainer title="Plugins">
			<nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
				{PLUGIN_OPTIONS.map((opt) => (
					<OptionCard
						key={opt.value}
						label={opt.label}
						subtitle={opt.description}
						selected={plugins.includes(opt.value as PluginType)}
						onClick={() => handleToggle(opt.value as PluginType)}
					/>
				))}
			</nav>
			<p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '1rem' }}>You can skip this step if you don't need plugins</p>
		</StepContainer>
	);
};

interface ReviewConfigItemProps {
	label: string;
	value: string;
}

const ReviewConfigItem = ({ label, value }: ReviewConfigItemProps) => (
	<p style={{ marginBottom: '0.75rem' }}>
		<span style={{ color: 'rgba(255,255,255,0.6)' }}>{label}:</span>{' '}
		<span style={{ color: '#fff' }}>{value}</span>
	</p>
);

interface ReviewStepProps extends ThemeProps {
	projectName: string;
	codeQuality: CodeQualityTool;
	useTailwind: boolean;
	frontends: string[];
	hasHtml: boolean;
	useHtmlScripts: boolean;
	database: DatabaseEngine;
	dbHost: DatabaseHost;
	orm: ORM;
	dirType: ConfigurationType;
	auth: AuthProvider;
	plugins: PluginType[];
}

const ReviewStep = ({
	projectName, codeQuality, useTailwind, frontends, hasHtml, useHtmlScripts,
	database, dbHost, orm, dirType, auth, plugins, themeSprings
}: ReviewStepProps) => {
	const showOrm = database !== 'none' && DATABASES_WITH_ORM.includes(database);

	return (
		<StepContainer title="Review Configuration">
			<article style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontFamily: 'monospace', padding: '1.5rem' }}>
				<ReviewConfigItem label="Project" value={projectName} />
				<ReviewConfigItem label="Code Quality" value={codeQuality} />
				<ReviewConfigItem label="Tailwind" value={useTailwind ? 'Yes' : 'No'} />
				<ReviewConfigItem label="Frontends" value={frontends.join(', ')} />
				{hasHtml && <ReviewConfigItem label="HTML Scripts" value={useHtmlScripts ? 'Yes' : 'No'} />}
				<ReviewConfigItem label="Database" value={database === 'none' ? 'None' : database} />
				{database !== 'none' && <ReviewConfigItem label="DB Host" value={dbHost === 'none' ? 'Local' : dbHost} />}
				{showOrm && <ReviewConfigItem label="ORM" value={orm} />}
				<ReviewConfigItem label="Structure" value={dirType} />
				<ReviewConfigItem label="Auth" value={auth === 'none' ? 'None' : 'Absolute Auth'} />
				<ReviewConfigItem label="Plugins" value={plugins.length ? plugins.join(', ') : 'None'} />
			</article>

			<article style={{ marginTop: '1.5rem' }}>
				<p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>CLI Command:</p>
				<PrismPlus codeString={buildCliCommand(projectName, codeQuality, useTailwind, frontends, useHtmlScripts, database, dbHost, orm, dirType, auth, plugins)} language="bash" showLineNumbers={false} themeSprings={themeSprings} />
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
		</StepContainer>
	);
};

interface WizardFooterProps {
	step: number;
	currentStepName: string;
	canGoNext: boolean;
	onBack: () => void;
	onNext: () => void;
	onGenerate: () => void;
}

const WizardFooter = ({ step, currentStepName, canGoNext, onBack, onNext, onGenerate }: WizardFooterProps) => {
	const isFirstStep = step === 0;
	const isReviewStep = currentStepName === 'Review';

	return (
		<footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem' }}>
			<button
				disabled={isFirstStep}
				onClick={onBack}
				style={{
					backgroundColor: 'transparent',
					border: '1px solid rgba(255, 255, 255, 0.2)',
					borderRadius: '8px',
					color: '#fff',
					cursor: isFirstStep ? 'not-allowed' : 'pointer',
					fontSize: '1rem',
					fontWeight: 500,
					opacity: isFirstStep ? BUTTON_OPACITY_DISABLED : 1,
					padding: '0.75rem 1.5rem'
				}}
				type="button"
			>
				Back
			</button>
			{isReviewStep ? (
				<button
					onClick={onGenerate}
					style={{
						backgroundColor: '#3b82f6',
						border: 'none',
						borderRadius: '8px',
						color: '#fff',
						cursor: 'pointer',
						fontSize: '1rem',
						fontWeight: 500,
						padding: '0.75rem 1.5rem'
					}}
					type="button"
				>
					Generate Project
				</button>
			) : (
				<button
					disabled={!canGoNext}
					onClick={onNext}
					style={{
						backgroundColor: canGoNext ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)',
						border: 'none',
						borderRadius: '8px',
						color: '#fff',
						cursor: canGoNext ? 'pointer' : 'not-allowed',
						fontSize: '1rem',
						fontWeight: 500,
						padding: '0.75rem 1.5rem'
					}}
					type="button"
				>
					Next
				</button>
			)}
		</footer>
	);
};

export const PlaygroundWizard = ({ onGenerate, themeSprings }: PlaygroundWizardProps) => {
	const [step, setStep] = useState(0);
	const [projectName, setProjectName] = useState('my-app');
	const [codeQuality, setCodeQuality] = useState<CodeQualityTool>('eslint+prettier');
	const [useTailwind, setUseTailwind] = useState(true);
	const [frontends, setFrontends] = useState<string[]>(['react']);
	const [useHtmlScripts, setUseHtmlScripts] = useState(false);
	const [database, setDatabase] = useState<DatabaseEngine>('none');
	const [dbHost, setDbHost] = useState<DatabaseHost>('none');
	const [orm, setOrm] = useState<ORM>('drizzle');
	const [dirType, setDirType] = useState<ConfigurationType>('default');
	const [auth, setAuth] = useState<AuthProvider>('none');
	const [plugins, setPlugins] = useState<PluginType[]>([]);
	const [nameError, setNameError] = useState('');

	const hasHtml = frontends.includes('html');
	const supportsOrm = DATABASES_WITH_ORM.includes(database);

	const steps = ['Project Name', 'Code Quality', 'Tailwind CSS', 'Frontend Frameworks'];
	if (hasHtml) steps.push('HTML Scripts');
	steps.push('Database');
	if (database !== 'none') steps.push('Database Host');
	if (database !== 'none' && supportsOrm) steps.push('ORM');
	steps.push('Folder Structure', 'Authentication', 'Plugins', 'Review');

	const totalSteps = steps.length;
	const currentStepName = steps[step] || '';

	const validateName = (name: string) => {
		if (!name?.trim()) {
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

	const canGoNext = () => {
		if (currentStepName === 'Project Name') return projectName.length > 0 && !nameError;
		if (currentStepName === 'Frontend Frameworks') return frontends.length > 0;
		if (currentStepName === 'Database Host') return isHostWorking(database, dbHost);

		return true;
	};

	const goNext = () => {
		if (currentStepName === 'Project Name' && !validateName(projectName)) return;
		if (currentStepName === 'Database') setDbHost(getDefaultHost(database));
		if (currentStepName === 'Frontend Frameworks' && !hasHtml) setUseHtmlScripts(false);
		if (step < totalSteps - 1) setStep(step + 1);
	};

	const goBack = () => {
		if (step > 0) setStep(step - 1);
	};

	const handleGenerate = () => {
		const config: PlaygroundConfig = {
			authProvider: auth, codeQualityTool: codeQuality, configurationType: dirType, databaseEngine: database, databaseHost: database !== 'none' ? dbHost : undefined, frontends, gitInit: false, installDeps: true, orm: database !== 'none' && supportsOrm ? orm : undefined, projectName, selectedPlugins: plugins, useHtmlScripts: hasHtml ? useHtmlScripts : false, useTailwind
		};
		onGenerate(config);
	};

	const renderCurrentStep = () => {
		switch (currentStepName) {
			case 'Project Name':
				return <ProjectNameStep projectName={projectName} nameError={nameError} onNameChange={setProjectName} onValidate={validateName} />;
			case 'Code Quality':
				return <CodeQualityStep codeQuality={codeQuality} onSelect={setCodeQuality} />;
			case 'Tailwind CSS':
				return <TailwindStep useTailwind={useTailwind} onSelect={setUseTailwind} />;
			case 'Frontend Frameworks':
				return <FrontendStep frontends={frontends} onFrontendsChange={setFrontends} />;
			case 'HTML Scripts':
				return <HtmlScriptsStep useHtmlScripts={useHtmlScripts} onSelect={setUseHtmlScripts} />;
			case 'Database':
				return <DatabaseStep database={database} onSelect={setDatabase} />;
			case 'Database Host':
				return <DatabaseHostStep database={database} dbHost={dbHost} onSelect={setDbHost} />;
			case 'ORM':
				return <OrmStep orm={orm} onSelect={setOrm} />;
			case 'Folder Structure':
				return <FolderStep dirType={dirType} onSelect={setDirType} />;
			case 'Authentication':
				return <AuthStep auth={auth} onSelect={setAuth} />;
			case 'Plugins':
				return <PluginsStep plugins={plugins} onPluginsChange={setPlugins} />;
			case 'Review':
				return (
					<ReviewStep
						projectName={projectName}
						codeQuality={codeQuality}
						useTailwind={useTailwind}
						frontends={frontends}
						hasHtml={hasHtml}
						useHtmlScripts={useHtmlScripts}
						database={database}
						dbHost={dbHost}
						orm={orm}
						dirType={dirType}
						auth={auth}
						plugins={plugins}
						themeSprings={themeSprings}
					/>
				);
			default:
				return null;
		}
	};

	const progressPercent = ((step + 1) / totalSteps) * PROGRESS_PERCENT_MULTIPLIER;

	return (
		<animated.div style={{
			backgroundColor: 'rgba(30, 30, 30, 0.8)',
			border: '1px solid rgba(255, 255, 255, 0.1)',
			borderRadius: '12px',
			marginTop: '2rem',
			padding: '2rem'
		}}>
			<header style={{ marginBottom: '2rem' }}>
				<nav style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
					<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>Step {step + 1} of {totalSteps}</span>
					<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{currentStepName}</span>
				</nav>
				<section style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', height: '4px', overflow: 'hidden' }}>
					<span style={{ backgroundColor: '#3b82f6', display: 'block', height: '100%', width: `${progressPercent}%` }} />
				</section>
			</header>

			{renderCurrentStep()}

			<WizardFooter
				step={step}
				currentStepName={currentStepName}
				canGoNext={canGoNext()}
				onBack={goBack}
				onNext={goNext}
				onGenerate={handleGenerate}
			/>
		</animated.div>
	);
};