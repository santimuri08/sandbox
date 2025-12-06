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
	icon?: string;
}

interface PluginOption extends LabelValue {
	description: string;
}

const FRONTEND_OPTIONS: LabelValue[] = [
	{ icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', label: 'React JS', value: 'react' },
	{ icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', label: 'Vue JS', value: 'vue' },
	{ icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg', label: 'Svelte Kit', value: 'svelte' },
	{ icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg', label: 'Angular JS', value: 'angular' },
	{ icon: 'https://cdn.jsdelivr.net/gh/bigskysoftware/htmx@master/www/static/img/htmx_logo.1.png', label: 'HTMX', value: 'htmx' },
	{ icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', label: 'Plain HTML', value: 'html' }
];

const DATABASE_OPTIONS: LabelValue[] = [
	{ label: 'No Database', value: 'none' },
	{ icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', label: 'PostgreSQL', value: 'postgresql' },
	{ icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', label: 'MySQL DB', value: 'mysql' },
	{ icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg', label: 'SQLite DB', value: 'sqlite' },
	{ icon: 'https://cdn.simpleicons.org/mariadb/003545', label: 'MariaDB', value: 'mariadb' },
	{ icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', label: 'MongoDB', value: 'mongodb' },
	{ icon: 'https://static.vecteezy.com/system/resources/thumbnails/004/657/673/small/database-line-style-icon-free-vector.jpg', label: 'Gel DB', value: 'gel' },
	{ icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyDv0EmLZSzlSvgIIB-9ebgg58_vL5BrYeDQ&s', label: 'SingleStore', value: 'singlestore' },
	{ icon: 'https://cdn.simpleicons.org/cockroachlabs/6933FF', label: 'CockroachDB', value: 'cockroachdb' },
	{ icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg', label: 'MS SQL Server', value: 'mssql' }
];

const HOST_OPTIONS: LabelValue[] = [
	{ icon: 'https://cdn.vectorstock.com/i/500p/88/11/neon-server-data-hosting-icon-vector-59858811.jpg', label: 'Neon Cloud', value: 'neon' },
	{ icon: 'https://cdn.simpleicons.org/planetscale/000000', label: 'PlanetScale', value: 'planetscale' },
	{ icon: 'https://avatars.githubusercontent.com/u/139391156?s=200&v=4', label: 'Turso Edge', value: 'turso' },
	{ icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', label: 'Local Docker', value: 'none' }
];

const ORM_OPTIONS: LabelValue[] = [
	{ icon: 'data:image/png;base64,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', label: 'Drizzle ORM', value: 'drizzle' },
	{ icon: 'https://cdn.simpleicons.org/prisma/2D3748', label: 'Prisma ORM', value: 'prisma' }
];

const PLUGIN_OPTIONS: PluginOption[] = [
	{ description: 'Cross-Origin Resource Sharing', label: 'CORS Plugin', value: '@elysiajs/cors' },
	{ description: 'API documentation', label: 'Swagger Docs', value: '@elysiajs/swagger' },
	{ description: 'Request rate limiting', label: 'Rate Limiter', value: 'elysia-rate-limit' }
];

const WORKING_HOSTS: Record<string, string[]> = {
	cockroachdb: [], gel: [], mariadb: [], mongodb: [], mssql: [], mysql: [], postgresql: ['neon'], singlestore: [], sqlite: ['turso', 'none']
};

const DATABASES_WITH_ORM = ['postgresql', 'sqlite', 'mysql', 'mariadb', 'singlestore', 'cockroachdb', 'mssql'];
const DOCKER_REQUIRED = ['postgresql', 'mysql', 'mariadb', 'mongodb', 'gel', 'singlestore', 'cockroachdb', 'mssql'];

const PROGRESS_PERCENT_MULTIPLIER = 100;
const BUTTON_OPACITY_DISABLED = 0.5;
const EMOJI_MAX_LENGTH = 4;

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
	icon?: string;
	selected: boolean;
	disabled?: boolean;
	onClick: () => void;
}

const OptionCard = ({ label, subtitle, icon, selected, disabled, onClick }: OptionCardProps) => {
	const isEmoji = icon && icon.length <= EMOJI_MAX_LENGTH;

	return (
		<article
			onClick={disabled ? undefined : onClick}
			style={{
				alignItems: 'center',
				backgroundColor: selected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.2)',
				border: `2px solid ${selected ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
				borderRadius: '8px',
				cursor: disabled ? 'not-allowed' : 'pointer',
				display: 'flex',
				gap: '0.75rem',
				opacity: disabled ? BUTTON_OPACITY_DISABLED : 1,
				padding: '1rem'
			}}
		>
			{icon && (
				isEmoji ? (
					<span style={{ fontSize: '1.5rem' }}>{icon}</span>
				) : (
					<img src={icon} alt="" style={{ height: '28px', objectFit: 'contain', width: '28px' }} />
				)
			)}
			<section>
				<p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>{label}</p>
				{subtitle && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>{subtitle}</p>}
			</section>
		</article>
	);
};

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
	<StepContainer title="Code Quality">
		<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
			<OptionCard label="ESLint + Prettier" selected={codeQuality === 'eslint+prettier'} onClick={() => onSelect('eslint+prettier')} />
			<OptionCard label="Biome Linter"  selected={codeQuality === 'biome'} onClick={() => onSelect('biome')} />
		</nav>
	</StepContainer>
);

interface TailwindStepProps {
	useTailwind: boolean;
	onSelect: (use: boolean) => void;
}

const TailwindStep = ({ useTailwind, onSelect }: TailwindStepProps) => (
	<StepContainer title="Tailwind CSS">
		<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
			<OptionCard label="Tailwind CSS" selected={useTailwind} onClick={() => onSelect(true)} />
			<OptionCard label="Skip Tailwind" selected={!useTailwind} onClick={() => onSelect(false)} />
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
		<StepContainer title="Frontend Framework">
			<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(3, 1fr)' }}>
				{FRONTEND_OPTIONS.map((opt) => (
					<OptionCard key={opt.value} label={opt.label} icon={opt.icon} selected={frontends.includes(opt.value)} onClick={() => handleToggle(opt.value)} />
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
	<StepContainer title="HTML Scripts">
		<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
			<OptionCard label="TypeScript HTML" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" subtitle="TypeScript in HTML" selected={useHtmlScripts} onClick={() => onSelect(true)} />
			<OptionCard label="Static HTML" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" subtitle="Plain HTML only" selected={!useHtmlScripts} onClick={() => onSelect(false)} />
		</nav>
	</StepContainer>
);

interface DatabaseStepProps {
	database: DatabaseEngine;
	onSelect: (db: DatabaseEngine) => void;
}

const DatabaseStep = ({ database, onSelect }: DatabaseStepProps) => (
	<StepContainer title="Database Engine">
		<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
			{DATABASE_OPTIONS.map((opt) => (
				<OptionCard key={opt.value} label={opt.label} icon={opt.icon} selected={database === opt.value} onClick={() => onSelect(opt.value as DatabaseEngine)} />
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
				alignItems: 'center',
				backgroundColor: dbHost === opt.value ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.2)',
				border: `2px solid ${dbHost === opt.value ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
				borderRadius: '8px',
				cursor: works ? 'pointer' : 'not-allowed',
				display: 'flex',
				gap: '0.75rem',
				opacity: works ? 1 : BUTTON_OPACITY_DISABLED,
				padding: '1rem'
			}}
		>
			{opt.icon && <img src={opt.icon} alt="" style={{ height: '28px', objectFit: 'contain', width: '28px' }} />}
			<section>
				<p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>{opt.label}</p>
				{showDocker && <p style={{ color: '#f59e0b', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>Docker required, not available in trial</p>}
				{!works && !isLocal && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>Not available for {database}</p>}
			</section>
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
		<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
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
		<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
			{ORM_OPTIONS.map((opt) => (
				<OptionCard key={opt.value} label={opt.label} icon={opt.icon} selected={orm === opt.value} onClick={() => onSelect(opt.value as ORM)} />
			))}
		</nav>
	</StepContainer>
);

interface FolderStepProps {
	dirType: ConfigurationType;
	onSelect: (type: ConfigurationType) => void;
}

const FolderStep = ({ dirType, onSelect }: FolderStepProps) => (
	<StepContainer title="Folder Structure">
		<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
			<OptionCard label="Default Layout" subtitle="Standard AbsoluteJS structure" selected={dirType === 'default'} onClick={() => onSelect('default')} />
			<OptionCard label="Custom Layout" subtitle="Customize folder layout" selected={dirType === 'custom'} onClick={() => onSelect('custom')} />
		</nav>
	</StepContainer>
);

interface AuthStepProps {
	auth: AuthProvider;
	onSelect: (auth: AuthProvider) => void;
}

const AuthStep = ({ auth, onSelect }: AuthStepProps) => (
	<StepContainer title="Authentication">
		<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, 1fr)' }}>
			<OptionCard label="Skip Auth" subtitle="No authentication setup" selected={auth === 'none'} onClick={() => onSelect('none')} />
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
		<StepContainer title="Elysia Plugins">
			<nav style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(3, 1fr)' }}>
				{PLUGIN_OPTIONS.map((opt) => (
					<OptionCard
						key={opt.value}
						label={opt.label}
						icon={opt.icon}
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

	const steps = ['Project Name', 'Code Quality', 'Tailwind CSS', 'Frontend Framework'];
	if (hasHtml) steps.push('HTML Scripts');
	steps.push('Database Engine');
	if (database !== 'none') steps.push('Database Host');
	if (database !== 'none' && supportsOrm) steps.push('ORM Selection');
	steps.push('Folder Structure', 'Authentication', 'Elysia Plugins', 'Review');

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
		if (currentStepName === 'Frontend Framework') return frontends.length > 0;
		if (currentStepName === 'Database Host') return isHostWorking(database, dbHost);

		return true;
	};

	const goNext = () => {
		if (currentStepName === 'Project Name' && !validateName(projectName)) return;
		if (currentStepName === 'Database Engine') setDbHost(getDefaultHost(database));
		if (currentStepName === 'Frontend Framework' && !hasHtml) setUseHtmlScripts(false);
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
			case 'Frontend Framework':
				return <FrontendStep frontends={frontends} onFrontendsChange={setFrontends} />;
			case 'HTML Scripts':
				return <HtmlScriptsStep useHtmlScripts={useHtmlScripts} onSelect={setUseHtmlScripts} />;
			case 'Database Engine':
				return <DatabaseStep database={database} onSelect={setDatabase} />;
			case 'Database Host':
				return <DatabaseHostStep database={database} dbHost={dbHost} onSelect={setDbHost} />;
			case 'ORM Selection':
				return <OrmStep orm={orm} onSelect={setOrm} />;
			case 'Folder Structure':
				return <FolderStep dirType={dirType} onSelect={setDirType} />;
			case 'Authentication':
				return <AuthStep auth={auth} onSelect={setAuth} />;
			case 'Elysia Plugins':
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