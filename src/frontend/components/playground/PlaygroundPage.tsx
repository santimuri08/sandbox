/**
 * PlaygroundPage.tsx
 *
 * WHERE IT GOES:
 * src/frontend/components/playground/PlaygroundPage.tsx
 */

import { useState, useRef, useEffect } from 'react';
import type { ThemeProps } from '../../../types/springTypes';
import { ErrorDisplay } from './ErrorDisplay';
import { FileViewer } from './FileViewer';
import { LoadingProgress } from './LoadingProgress';
import { PlaygroundHero } from './PlaygroundHero';
import { PlaygroundWizard } from './PlaygroundWizard';

// ============================================================================
// CONSTANTS
// ============================================================================

const STEP_DELAY_1 = 500;
const STEP_DELAY_2 = 2000;
const STEP_DELAY_3 = 3000;
const STEP_DELAY_4 = 5000;

const STEP_INTERVALS = [STEP_DELAY_1, STEP_DELAY_2, STEP_DELAY_3, STEP_DELAY_4];

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const createStepAdvancer = (
	setLoadingStep: (step: number) => void
) => {
	let currentStep = 0;

	const advanceStep = () => {
		const hasMoreSteps = currentStep < STEP_INTERVALS.length;

		if (!hasMoreSteps) {
			return;
		}

		const delay = STEP_INTERVALS[currentStep];

		setTimeout(() => {
			currentStep++;
			setLoadingStep(currentStep);
			advanceStep();
		}, delay);
	};

	return advanceStep;
};

const fetchGeneratedProject = async (
	wizardConfig: PlaygroundConfig,
	signal: AbortSignal
) => {
	const response = await fetch('/api/v1/sandbox/generate', {
		body: JSON.stringify(wizardConfig),
		headers: {
			'Content-Type': 'application/json'
		},
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

// ============================================================================
// COMPONENT
// ============================================================================

export const PlaygroundPage = ({ themeSprings }: ThemeProps) => {
	const [pageState, setPageState] = useState<PageState>('wizard');
	const [config, setConfig] = useState<PlaygroundConfig | null>(null);
	const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
	const [cliCommand, setCliCommand] = useState<string>('');
	const [cliOutput, setCliOutput] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [loadingStep, setLoadingStep] = useState<number>(0);
	const abortControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		const isLoading = pageState === 'loading';

		if (!isLoading) {
			return;
		}

		const advanceStep = createStepAdvancer(setLoadingStep);
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
			const isAbortError = err instanceof Error && err.name === 'AbortError';

			if (isAbortError) {
				return;
			}

			console.error('Generation error:', err);
			const message = err instanceof Error ? err.message : 'An unexpected error occurred';
			setErrorMessage(message);
			setPageState('error');
		}
	};

	const handleCancel = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

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

	const showWizard = pageState === 'wizard';
	const showLoading = pageState === 'loading';
	const showSuccess = pageState === 'success' && config !== null;
	const showError = pageState === 'error';

	return (
		<main
			style={{
				minHeight: '100vh',
				padding: '2rem'
			}}
		>
			<section
				style={{
					margin: '0 auto',
					maxWidth: '1200px'
				}}
			>
				<PlaygroundHero themeSprings={themeSprings} />

				{showWizard && (
					<PlaygroundWizard
						themeSprings={themeSprings}
						onGenerate={handleGenerate}
					/>
				)}

				{showLoading && (
					<LoadingProgress
						themeSprings={themeSprings}
						currentStep={loadingStep}
						onCancel={handleCancel}
					/>
				)}

				{showSuccess && (
					<FileViewer
						themeSprings={themeSprings}
						files={generatedFiles}
						projectName={config.projectName}
						cliCommand={cliCommand}
						cliOutput={cliOutput}
						onStartOver={handleStartOver}
					/>
				)}

				{showError && (
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