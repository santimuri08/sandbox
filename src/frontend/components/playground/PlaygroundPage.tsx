import { useState, useRef, useEffect } from 'react';
import type { ThemeProps } from '../../../types/springTypes';
import { ErrorDisplay } from './ErrorDisplay';
import { FileViewer } from './FileViewer';
import { LoadingProgress } from './LoadingProgress';
import { PlaygroundHero } from './PlaygroundHero';
import { PlaygroundWizard } from './PlaygroundWizard';

export interface PlaygroundConfig {
	projectName: string;
	codeQualityTool: 'eslint+prettier' | 'biome';
	useTailwind: boolean;
	useHtmlScripts: boolean;
	frontends: string[];
	databaseEngine: 'none' | 'postgresql' | 'sqlite' | 'mysql' | 'mariadb' | 'gel' | 'mongodb' | 'singlestore' | 'cockroachdb' | 'mssql';
	databaseHost?: 'none' | 'neon' | 'planetscale' | 'turso';
	orm?: 'drizzle' | 'prisma';
	configurationType: 'default' | 'custom';
	authProvider: 'none' | 'absoluteAuth';
	selectedPlugins: ('@elysiajs/cors' | '@elysiajs/swagger' | 'elysia-rate-limit')[];
	gitInit: boolean;
	installDeps: boolean;
}

interface GeneratedFile {
	path: string;
	content: string;
}

interface GenerateResponse {
	success: boolean;
	message: string;
	cliCommand: string;
	cliOutput: string;
	files: GeneratedFile[];
}

type PageState = 'wizard' | 'loading' | 'success' | 'error';

const LOADING_DELAY_STEP_1 = 500;
const LOADING_DELAY_STEP_2 = 2000;
const LOADING_DELAY_STEP_3 = 3000;
const LOADING_DELAY_STEP_4 = 5000;
const LOADING_DELAYS = [LOADING_DELAY_STEP_1, LOADING_DELAY_STEP_2, LOADING_DELAY_STEP_3, LOADING_DELAY_STEP_4];

const fetchGeneratedProject = async (config: PlaygroundConfig, signal: AbortSignal) => {
	const response = await fetch('/api/v1/sandbox/generate', {
		body: JSON.stringify(config),
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
		signal
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || `Server error: ${response.status}`);
	}

	const data: GenerateResponse = await response.json();

	if (!data.success) {
		throw new Error(data.message || 'Generation failed');
	}

	return data;
};

export const PlaygroundPage = ({ themeSprings }: ThemeProps) => {
	const [pageState, setPageState] = useState<PageState>('wizard');
	const [config, setConfig] = useState<PlaygroundConfig | null>(null);
	const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
	const [cliCommand, setCliCommand] = useState('');
	const [cliOutput, setCliOutput] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [loadingStep, setLoadingStep] = useState(0);
	const abortControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		if (pageState !== 'loading') return;

		let step = 0;
		const advanceStep = () => {
			if (step >= LOADING_DELAYS.length) return;
			
			setTimeout(() => {
				step++;
				setLoadingStep(step);
				advanceStep();
			}, LOADING_DELAYS[step]);
		};

		advanceStep();
	}, [pageState]);

	const handleGenerate = async (wizardConfig: PlaygroundConfig) => {
		setConfig(wizardConfig);
		setPageState('loading');
		setLoadingStep(0);
		setErrorMessage('');

		abortControllerRef.current = new AbortController();

		try {
			const data = await fetchGeneratedProject(wizardConfig, abortControllerRef.current.signal);
			setGeneratedFiles(data.files);
			setCliCommand(data.cliCommand);
			setCliOutput(data.cliOutput);
			setPageState('success');
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') return;
			
			console.error('Generation error:', err);
			setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
			setPageState('error');
		}
	};

	const handleCancel = () => {
		abortControllerRef.current?.abort();
		setPageState('wizard');
	};

	const handleStartOver = () => {
		setPageState('wizard');
		setConfig(null);
		setGeneratedFiles([]);
		setCliCommand('');
		setCliOutput('');
		setErrorMessage('');
		setLoadingStep(0);
	};

	return (
		<main style={{ minHeight: '100vh', padding: '2rem' }}>
			<section style={{ margin: '0 auto', maxWidth: '1200px' }}>
				<PlaygroundHero themeSprings={themeSprings} />

				{pageState === 'wizard' && (
					<PlaygroundWizard
						themeSprings={themeSprings}
						onGenerate={handleGenerate}
					/>
				)}

				{pageState === 'loading' && (
					<LoadingProgress
						themeSprings={themeSprings}
						currentStep={loadingStep}
						onCancel={handleCancel}
					/>
				)}

				{pageState === 'success' && config && (
					<FileViewer
						themeSprings={themeSprings}
						files={generatedFiles}
						projectName={config.projectName}
						cliCommand={cliCommand}
						cliOutput={cliOutput}
						onStartOver={handleStartOver}
					/>
				)}

				{pageState === 'error' && (
					<ErrorDisplay
						themeSprings={themeSprings}
						errorMessage={errorMessage}
						onRetry={handleStartOver}
					/>
				)}
			</section>
		</main>
	);
};