import { useState } from 'react';
import { animated } from '@react-spring/web';
import type { ThemeProps } from '../../../types/springTypes';
import type { PlaygroundConfig } from './PlaygroundPage';
interface PlaygroundWizardProps extends ThemeProps {
	onGenerate: (config: PlaygroundConfig) => void;
}
type DatabaseEngine = 'none' | 'postgresql' | 'sqlite' | 'mysql' | 'mariadb' | 'gel' | 'mongodb' | 'singlestore' | 'cockroachdb' | 'mssql';
type DatabaseHost = 'none' | 'neon' | 'planetscale' | 'turso';
type ORM = 'drizzle' | 'prisma';
const FRONTEND_OPTIONS = [
	{ value: 'react', label: 'React', description: 'Popular UI library' },
	{ value: 'vue', label: 'Vue', description: 'Progressive framework' },
	{ value: 'svelte', label: 'Svelte', description: 'Compile-time framework' },
	{ value: 'angular', label: 'Angular', description: 'Full-featured framework' },
	{ value: 'htmx', label: 'HTMX', description: 'HTML-driven interactivity' },
	{ value: 'html', label: 'HTML', description: 'Plain HTML frontend' }
];
const DATABASE_OPTIONS = [
	{ value: 'none', label: 'None', description: 'No database' },
	{ value: 'postgresql', label: 'PostgreSQL', description: 'Powerful relational database' },
	{ value: 'mysql', label: 'MySQL', description: 'Popular relational database' },
	{ value: 'sqlite', label: 'SQLite', description: 'Lightweight file-based database' },
	{ value: 'mariadb', label: 'MariaDB', description: 'MySQL-compatible database' },
	{ value: 'mongodb', label: 'MongoDB', description: 'Document database' },
	{ value: 'gel', label: 'Gel', description: 'Graph database' },
	{ value: 'singlestore', label: 'SingleStore', description: 'Distributed SQL database' },
	{ value: 'cockroachdb', label: 'CockroachDB', description: 'Distributed SQL database' },
	{ value: 'mssql', label: 'MS SQL', description: 'Microsoft SQL Server' }
];
const HOST_OPTIONS = [
	{ value: 'neon', label: 'Neon', description: 'Serverless Postgres' },
	{ value: 'planetscale', label: 'PlanetScale', description: 'Serverless MySQL-compatible' },
	{ value: 'turso', label: 'Turso', description: 'SQLite at the edge' },
	{ value: 'none', label: 'Local (Docker/File)', description: 'Run locally' }
];
const WORKING_COMBINATIONS: Record<string, string[]> = {
	postgresql: ['neon', 'planetscale', 'turso', 'none'],
	sqlite: ['neon', 'planetscale', 'turso', 'none'],
	mysql: ['neon', 'planetscale', 'turso', 'none'],
	mariadb: ['neon', 'planetscale', 'turso', 'none'],
	mongodb: ['neon', 'planetscale', 'turso', 'none'],
	gel: ['neon', 'planetscale', 'turso', 'none'],
	singlestore: ['neon', 'planetscale', 'turso', 'none'],
	cockroachdb: ['neon', 'planetscale', 'turso', 'none'],
	mssql: ['neon', 'planetscale', 'turso', 'none']
};
const DATABASES_WITH_ORM = ['postgresql', 'sqlite', 'mysql', 'mariadb', 'singlestore', 'cockroachdb', 'mssql'];
const ORM_OPTIONS = [
	{ value: 'drizzle', label: 'Drizzle', description: 'TypeScript-first ORM' },
	{ value: 'prisma', label: 'Prisma', description: 'Next-generation ORM' }
];
const PLUGIN_OPTIONS = [
	{ value: '@elysiajs/cors', label: 'CORS', description: 'Cross-Origin Resource Sharing' },
	{ value: '@elysiajs/swagger', label: 'Swagger', description: 'API documentation' },
	{ value: 'elysia-rate-limit', label: 'Rate Limit', description: 'Request rate limiting' }
];
const cardStyle = {
	backgroundColor: 'rgba(30, 30, 30, 0.8)',
	borderRadius: '12px',
	padding: '2rem',
	marginTop: '2rem',
	border: '1px solid rgba(255, 255, 255, 0.1)'
};
const buttonStyle = (primary: boolean = false) => ({
	padding: '0.75rem 1.5rem',
	borderRadius: '8px',
	border: primary ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
	backgroundColor: primary ? '#3b82f6' : 'transparent',
	color: '#fff',
	cursor: 'pointer',
	fontSize: '1rem',
	fontWeight: 500,
	transition: 'all 0.2s ease'
});
const disabledButtonStyle = {
	...buttonStyle(true),
	backgroundColor: '#4b5563',
	cursor: 'not-allowed',
	opacity: 0.6
};
const inputStyle = {
	width: '100%',
	padding: '0.75rem 1rem',
	borderRadius: '8px',
	border: '1px solid rgba(255, 255, 255, 0.2)',
	backgroundColor: 'rgba(0, 0, 0, 0.3)',
	color: '#fff',
	fontSize: '1rem',
	outline: 'none'
};
const optionCardStyle = (selected: boolean, disabled: boolean = false) => ({
	padding: '1rem',
	borderRadius: '8px',
	border: `2px solid ${selected ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
	backgroundColor: selected ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.2)',
	cursor: disabled ? 'not-allowed' : 'pointer',
	transition: 'all 0.2s ease',
	opacity: disabled ? 0.5 : 1,
	position: 'relative' as const
});
const comingSoonBadge = {
	position: 'absolute' as const,
	top: '0.5rem',
	right: '0.5rem',
	backgroundColor: '#f59e0b',
	color: '#000',
	fontSize: '0.625rem',
	fontWeight: 700,
	padding: '0.125rem 0.375rem',
	borderRadius: '4px',
	textTransform: 'uppercase' as const
};
export function PlaygroundWizard({ themeSprings, onGenerate }: PlaygroundWizardProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [projectName, setProjectName] = useState('my-app');
	const [codeQualityTool, setCodeQualityTool] = useState<'eslint+prettier' | 'biome'>('eslint+prettier');
	const [useTailwind, setUseTailwind] = useState(true);
	const [frontends, setFrontends] = useState<string[]>(['react']);
	const [useHtmlScripts, setUseHtmlScripts] = useState(false);
	const [databaseEngine, setDatabaseEngine] = useState<DatabaseEngine>('none');
	const [databaseHost, setDatabaseHost] = useState<DatabaseHost>('none');
	const [orm, setOrm] = useState<ORM>('drizzle');
	const [configurationType, setConfigurationType] = useState<'default' | 'custom'>('default');
	const [authProvider, setAuthProvider] = useState<'none' | 'absoluteAuth'>('none');
	const [selectedPlugins, setSelectedPlugins] = useState<('@elysiajs/cors' | '@elysiajs/swagger' | 'elysia-rate-limit')[]>([]);
	const [nameError, setNameError] = useState<string>('');
	const hasHtmlFrontend = (): boolean => {
		return frontends.includes('html');
	};
	const supportsOrm = (db: DatabaseEngine): boolean => {
		return DATABASES_WITH_ORM.includes(db);
	};
	const isHostWorkingForDatabase = (db: DatabaseEngine, host: string): boolean => {
		const workingHosts = WORKING_COMBINATIONS[db] || ['none'];
		return workingHosts.includes(host);
	};
	const getDefaultHostForDatabase = (db: DatabaseEngine): DatabaseHost => {
		const workingHosts = WORKING_COMBINATIONS[db] || ['none'];
		const cloudOption = workingHosts.find(h => h !== 'none');
		return (cloudOption || 'none') as DatabaseHost;
	};
	const getSteps = () => {
		const steps = [
			'Project Name',
			'Code Quality', 
			'Tailwind CSS',
			'Frontend Frameworks'
		];
		if (hasHtmlFrontend()) {
			steps.push('HTML Scripts');
		}
		steps.push('Database'); 
		if (databaseEngine !== 'none') {
			steps.push('Database Host');
		}
		if (databaseEngine !== 'none' && supportsOrm(databaseEngine)) {
			steps.push('ORM');
		}
		steps.push('Folder Structure');
		steps.push('Authentication');
		steps.push('Plugins');
		steps.push('Review');
		return steps;
	};
	const steps = getSteps();
	const totalSteps = steps.length;
	const validateProjectName = (name: string): boolean => {
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
	const canProceed = (): boolean => {
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
			projectName,
			codeQualityTool,
			useTailwind,
			useHtmlScripts: hasHtmlFrontend() ? useHtmlScripts : false,
			frontends,
			databaseEngine,
			databaseHost: databaseEngine !== 'none' ? databaseHost : undefined,
			orm: databaseEngine !== 'none' && supportsOrm(databaseEngine) ? orm : undefined,
			configurationType,
			authProvider,
			selectedPlugins,
			gitInit: false,
			installDeps: true
		};
		onGenerate(config);
	};
	const toggleFrontend = (value: string) => {
		setFrontends(prev =>
			prev.includes(value)
				? prev.filter(f => f !== value)
				: [...prev, value]
		);
	};
	const togglePlugin = (value: '@elysiajs/cors' | '@elysiajs/swagger' | 'elysia-rate-limit') => {
		setSelectedPlugins(prev =>
			prev.includes(value)
				? prev.filter(p => p !== value)
				: [...prev, value]
		);
	};
	const renderStep = () => {
		const stepName = steps[currentStep];
		switch (stepName) {
			case 'Project Name':
				return (
					<div>
						<h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
							Project Name
						</h2>
						<p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
							Choose a name for your AbsoluteJS project
						</p>
						<input
							type="text"
							value={projectName}
							onChange={(e) => {
								setProjectName(e.target.value);
								validateProjectName(e.target.value);
							}}
							placeholder="my-app"
							style={inputStyle}
						/>
						{nameError && (
							<p style={{ color: '#ef4444', marginTop: '0.5rem', fontSize: '0.875rem' }}>
								{nameError}
							</p>
						)}
					</div>
				);
			case 'Code Quality':
				return (
					<div>
						<h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
							Code Quality Tool
						</h2>
						<p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
							Choose your preferred linting and formatting setup
						</p>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
							<div
								onClick={() => setCodeQualityTool('eslint+prettier')}
								style={optionCardStyle(codeQualityTool === 'eslint+prettier')}
							>
								<div style={{ fontWeight: 600, color: '#fff' }}>ESLint + Prettier</div>
								<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
									Industry standard combination
								</div>
							</div>
							<div
								onClick={() => setCodeQualityTool('biome')}
								style={optionCardStyle(codeQualityTool === 'biome')}
							>
								<div style={{ fontWeight: 600, color: '#fff' }}>Biome</div>
								<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
									Fast, all-in-one toolchain
								</div>
							</div>
						</div>
					</div>
				);
			case 'Tailwind CSS':
				return (
					<div>
						<h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
							Tailwind CSS
						</h2>
						<p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
							Would you like to include Tailwind CSS for styling?
						</p>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
							<div
								onClick={() => setUseTailwind(true)}
								style={optionCardStyle(useTailwind)}
							>
								<div style={{ fontWeight: 600, color: '#fff' }}>Yes, include Tailwind</div>
								<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
									Utility-first CSS framework
								</div>
							</div>
							<div
								onClick={() => setUseTailwind(false)}
								style={optionCardStyle(!useTailwind)}
							>
								<div style={{ fontWeight: 600, color: '#fff' }}>No, skip Tailwind</div>
								<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
									Use your own CSS solution
								</div>
							</div>
						</div>
					</div>
				);
			case 'Frontend Frameworks':
				return (
					<div>
						<h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
							Frontend Frameworks
						</h2>
						<p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
							Select one or more frontend frameworks (at least one required)
						</p>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
							{FRONTEND_OPTIONS.map(option => (
								<div
									key={option.value}
									onClick={() => toggleFrontend(option.value)}
									style={optionCardStyle(frontends.includes(option.value))}
								>
									<div style={{ fontWeight: 600, color: '#fff' }}>{option.label}</div>
									<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
										{option.description}
									</div>
								</div>
							))}
						</div>
						{frontends.length === 0 && (
							<p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.875rem' }}>
								Please select at least one frontend framework
							</p>
						)}
					</div>
				);
			case 'HTML Scripts':
				return (
					<div>
						<h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
							HTML Scripting
						</h2>
						<p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
							Enable TypeScript scripting for your HTML frontend?
						</p>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
							<div
								onClick={() => setUseHtmlScripts(true)}
								style={optionCardStyle(useHtmlScripts)}
							>
								<div style={{ fontWeight: 600, color: '#fff' }}>Yes, enable HTML scripts</div>
								<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
									Use TypeScript in your HTML pages
								</div>
							</div>
							<div
								onClick={() => setUseHtmlScripts(false)}
								style={optionCardStyle(!useHtmlScripts)}
							>
								<div style={{ fontWeight: 600, color: '#fff' }}>No, plain HTML only</div>
								<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
									Static HTML without scripting
								</div>
							</div>
						</div>
					</div>
				);
			case 'Database':
				return (
					<div>
						<h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
							Database Engine
						</h2>
						<p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
							Select a database for your project
						</p>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
							{DATABASE_OPTIONS.map(option => (
								<div
									key={option.value}
									onClick={() => setDatabaseEngine(option.value as DatabaseEngine)}
									style={optionCardStyle(databaseEngine === option.value)}
								>
									<div style={{ fontWeight: 600, color: '#fff' }}>{option.label}</div>
									<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
										{option.description}
									</div>
								</div>
							))}
						</div>
					</div>
				);
			case 'Database Host':
				return (
					<div>
						<h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
							Database Host
						</h2>
						<p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
							Choose where to host your {databaseEngine} database
						</p>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
							{HOST_OPTIONS.map(option => {
								const isWorking = isHostWorkingForDatabase(databaseEngine, option.value);
								const isSelected = databaseHost === option.value;
								return (
									<div
										key={option.value}
										onClick={() => {
											if (isWorking) {
												setDatabaseHost(option.value as DatabaseHost);
											}
										}}
										style={optionCardStyle(isSelected, !isWorking)}
									>
										<div style={{ fontWeight: 600, color: '#fff' }}>{option.label}</div>
										<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
											{option.description}
										</div>
									</div>
								);
							})}
						</div>
						<p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '1rem', fontSize: '0.8rem' }}>
							Options marked "Coming Soon" will be available in a future update
						</p>
					</div>
				);
			case 'ORM':
				return (
					<div>
						<h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
							ORM Selection
						</h2>
						<p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
							Choose an ORM for database interactions
						</p>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
							{ORM_OPTIONS.map(option => (
								<div
									key={option.value}
									onClick={() => setOrm(option.value as ORM)}
									style={optionCardStyle(orm === option.value)}
								>
									<div style={{ fontWeight: 600, color: '#fff' }}>{option.label}</div>
									<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
										{option.description}
									</div>
								</div>
							))}
						</div>
					</div>
				);
			case 'Folder Structure':
				return (
					<div>
						<h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
							Folder Configuration
						</h2>
						<p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
							Choose your project's folder structure
						</p>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
							<div
								onClick={() => setConfigurationType('default')}
								style={optionCardStyle(configurationType === 'default')}
							>
								<div style={{ fontWeight: 600, color: '#fff' }}>Default</div>
								<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
									Standard AbsoluteJS structure
								</div>
							</div>
							<div
								onClick={() => setConfigurationType('custom')}
								style={optionCardStyle(configurationType === 'custom')}
							>
								<div style={{ fontWeight: 600, color: '#fff' }}>Custom</div>
								<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
									Customize folder layout
								</div>
							</div>
						</div>
					</div>
				);
			case 'Authentication':
				return (
					<div>
						<h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
							Authentication
						</h2>
						<p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
							Would you like to include authentication?
						</p>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
							<div
								onClick={() => setAuthProvider('none')}
								style={optionCardStyle(authProvider === 'none')}
							>
								<div style={{ fontWeight: 600, color: '#fff' }}>No Authentication</div>
								<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
									Skip authentication setup
								</div>
							</div>
							<div
								onClick={() => setAuthProvider('absoluteAuth')}
								style={optionCardStyle(authProvider === 'absoluteAuth')}
							>
								<div style={{ fontWeight: 600, color: '#fff' }}>Absolute Auth</div>
								<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
									Built-in authentication system
								</div>
							</div>
						</div>
					</div>
				);
			case 'Plugins':
				return (
					<div>
						<h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
							Plugins
						</h2>
						<p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
							Select optional plugins to include (optional)
						</p>
						<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
							{PLUGIN_OPTIONS.map(option => (
								<div
									key={option.value}
									onClick={() => togglePlugin(option.value as '@elysiajs/cors' | '@elysiajs/swagger' | 'elysia-rate-limit')}
									style={optionCardStyle(selectedPlugins.includes(option.value as '@elysiajs/cors' | '@elysiajs/swagger' | 'elysia-rate-limit'))}
								>
									<div style={{ fontWeight: 600, color: '#fff' }}>{option.label}</div>
									<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
										{option.description}
									</div>
								</div>
							))}
						</div>
						<p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '1rem', fontSize: '0.8rem' }}>
							You can skip this step if you don't need any plugins
						</p>
					</div>
				);
			case 'Review':
				return (
					<div>
						<h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
							Review Configuration
						</h2>
						<p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
							Review your choices before generating the project
						</p>
						<div style={{
							backgroundColor: 'rgba(0,0,0,0.3)',
							borderRadius: '8px',
							padding: '1.5rem',
							fontFamily: 'monospace'
						}}>
							<div style={{ marginBottom: '0.75rem' }}>
								<span style={{ color: 'rgba(255,255,255,0.6)' }}>Project Name:</span>{' '}
								<span style={{ color: '#fff' }}>{projectName}</span>
							</div>
							<div style={{ marginBottom: '0.75rem' }}>
								<span style={{ color: 'rgba(255,255,255,0.6)' }}>Code Quality:</span>{' '}
								<span style={{ color: '#fff' }}>{codeQualityTool}</span>
							</div>
							<div style={{ marginBottom: '0.75rem' }}>
								<span style={{ color: 'rgba(255,255,255,0.6)' }}>Tailwind:</span>{' '}
								<span style={{ color: '#fff' }}>{useTailwind ? 'Yes' : 'No'}</span>
							</div>
							<div style={{ marginBottom: '0.75rem' }}>
								<span style={{ color: 'rgba(255,255,255,0.6)' }}>Frontends:</span>{' '}
								<span style={{ color: '#fff' }}>{frontends.join(', ')}</span>
							</div>
							{hasHtmlFrontend() && (
								<div style={{ marginBottom: '0.75rem' }}>
									<span style={{ color: 'rgba(255,255,255,0.6)' }}>HTML Scripts:</span>{' '}
									<span style={{ color: '#fff' }}>{useHtmlScripts ? 'Yes' : 'No'}</span>
								</div>
							)}
							<div style={{ marginBottom: '0.75rem' }}>
								<span style={{ color: 'rgba(255,255,255,0.6)' }}>Database:</span>{' '}
								<span style={{ color: '#fff' }}>
									{databaseEngine === 'none' ? 'None' : databaseEngine}
								</span>
							</div>
							{databaseEngine !== 'none' && (
								<div style={{ marginBottom: '0.75rem' }}>
									<span style={{ color: 'rgba(255,255,255,0.6)' }}>Database Host:</span>{' '}
									<span style={{ color: '#fff' }}>
										{databaseHost === 'none' ? 'Local (Docker/File)' : databaseHost}
									</span>
								</div>
							)}
							{databaseEngine !== 'none' && supportsOrm(databaseEngine) && (
								<div style={{ marginBottom: '0.75rem' }}>
									<span style={{ color: 'rgba(255,255,255,0.6)' }}>ORM:</span>{' '}
									<span style={{ color: '#fff' }}>{orm}</span>
								</div>
							)}
							<div style={{ marginBottom: '0.75rem' }}>
								<span style={{ color: 'rgba(255,255,255,0.6)' }}>Folder Structure:</span>{' '}
								<span style={{ color: '#fff' }}>{configurationType}</span>
							</div>
							<div style={{ marginBottom: '0.75rem' }}>
								<span style={{ color: 'rgba(255,255,255,0.6)' }}>Authentication:</span>{' '}
								<span style={{ color: '#fff' }}>{authProvider === 'none' ? 'None' : 'Absolute Auth'}</span>
							</div>
							<div style={{ marginBottom: '0.75rem' }}>
								<span style={{ color: 'rgba(255,255,255,0.6)' }}>Plugins:</span>{' '}
								<span style={{ color: '#fff' }}>
									{selectedPlugins.length > 0 ? selectedPlugins.join(', ') : 'None'}
								</span>
							</div>
							<div style={{ marginBottom: '0.75rem' }}>
								<span style={{ color: 'rgba(255,255,255,0.6)' }}>Package Manager:</span>{' '}
								<span style={{ color: '#10b981' }}>Bun</span>
							</div>
						</div>
						<div style={{ marginTop: '1.5rem' }}>
							<div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
								CLI Command:
							</div>
							<div style={{
								backgroundColor: 'rgba(0,0,0,0.5)',
								borderRadius: '8px',
								padding: '1rem',
								fontFamily: 'monospace',
								fontSize: '0.875rem',
								color: '#10b981',
								overflowX: 'auto',
								whiteSpace: 'pre-wrap',
								wordBreak: 'break-all'
							}}>
								{buildCliPreview()}
							</div>
						</div>
						<div style={{
							marginTop: '1rem',
							padding: '0.75rem 1rem',
							backgroundColor: 'rgba(59, 130, 246, 0.1)',
							borderRadius: '8px',
							border: '1px solid rgba(59, 130, 246, 0.2)'
						}}>
							<p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', margin: 0 }}>
								Dependencies will be installed automatically. This may take 2-5 minutes.
							</p>
						</div>
					</div>
				);
			default:
				return null;
		}
	};
	const buildCliPreview = (): string => {
		const parts = ['bun create absolutejs', projectName, '--skip'];
		if (codeQualityTool === 'biome') {
			parts.push('--biome');
		} else {
			parts.push('--eslint+prettier');
		}
		if (useTailwind) parts.push('--tailwind');
		frontends.forEach(f => parts.push(`--${f}`));
		if (hasHtmlFrontend() && useHtmlScripts) {
			parts.push('--html-scripts');
		}
		if (databaseEngine !== 'none') {
			parts.push(`--db ${databaseEngine}`);
			if (databaseHost && databaseHost !== 'none') {
				parts.push(`--db-host ${databaseHost}`);
			}
			if (supportsOrm(databaseEngine) && orm) {
				parts.push(`--orm ${orm}`);
			}
		}
		parts.push(`--directory ${configurationType}`);
		if (authProvider !== 'none') {
			parts.push(`--auth ${authProvider}`);
		}
		selectedPlugins.forEach(p => parts.push(`--plugin ${p}`));
		parts.push('--install');
		return parts.join(' ');
	};
	return (
		<animated.div style={cardStyle}>
			<div style={{ marginBottom: '2rem' }}>
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '0.5rem'
				}}>
					<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
						Step {currentStep + 1} of {totalSteps}
					</span>
					<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
						{steps[currentStep]}
					</span>
				</div>
				<div style={{
					height: '4px',
					backgroundColor: 'rgba(255,255,255,0.1)',
					borderRadius: '2px',
					overflow: 'hidden'
				}}>
					<div style={{
						height: '100%',
						width: `${((currentStep + 1) / totalSteps) * 100}%`,
						backgroundColor: '#3b82f6',
						transition: 'width 0.3s ease'
					}} />
				</div>
			</div>
			{renderStep()}
			<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				marginTop: '2rem',
				paddingTop: '1.5rem',
				borderTop: '1px solid rgba(255,255,255,0.1)'
			}}>
				<button
					onClick={handleBack}
					disabled={currentStep === 0}
					style={{
						...buttonStyle(false),
						opacity: currentStep === 0 ? 0.5 : 1,
						cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
					}}
				>
					Back
				</button>
				{steps[currentStep] === 'Review' ? (
					<button
						onClick={handleGenerate}
						style={buttonStyle(true)}
					>
						Generate Project
					</button>
				) : (
					<button
						onClick={handleNext}
						disabled={!canProceed()}
						style={canProceed() ? buttonStyle(true) : disabledButtonStyle}
					>
						Next
					</button>
				)}
			</div>
		</animated.div>
	);
}