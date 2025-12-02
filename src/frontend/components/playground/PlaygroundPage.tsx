/**
 * PlaygroundPage.tsx
 *
 * WHERE IT GOES:
 * src/frontend/components/playground/PlaygroundPage.tsx
 */

import { useState, useRef, useEffect } from 'react';
import type { ThemeProps } from '../../../types/springTypes';
import { PlaygroundHero } from './PlaygroundHero';
import { PlaygroundWizard } from './PlaygroundWizard';
import { FileViewer } from './FileViewer';
import { LoadingProgress } from './LoadingProgress';
import { ErrorDisplay } from './ErrorDisplay';

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
// COMPONENT
// ============================================================================

export function PlaygroundPage({ themeSprings }: ThemeProps) {
	const [pageState, setPageState] = useState<PageState>('wizard');
	const [config, setConfig] = useState<PlaygroundConfig | null>(null);
	const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
	const [cliCommand, setCliCommand] = useState<string>('');
	const [cliOutput, setCliOutput] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [loadingStep, setLoadingStep] = useState<number>(0);
	const abortControllerRef = useRef<AbortController | null>(null);

	const loadingSteps = [
		'Validating configuration...',
		'Running bun create absolutejs...',
		'Installing dependencies (this may take a few minutes)...',
		'Generating project files...',
		'Preparing file viewer...'
	];

	useEffect(() => {
		if (pageState === 'loading') {
			const intervals = [500, 2000, 3000, 5000];
			let currentStep = 0;

			const advanceStep = () => {
				if (currentStep < intervals.length) {
					setTimeout(() => {
						currentStep++;
						setLoadingStep(currentStep);
						advanceStep();
					}, intervals[currentStep]);
				}
			};

			advanceStep();
		}
	}, [pageState]);

	const handleGenerate = async (wizardConfig: PlaygroundConfig) => {
		setConfig(wizardConfig);
		setPageState('loading');
		setLoadingStep(0);
		setErrorMessage('');

		abortControllerRef.current = new AbortController();

		try {
			const response = await fetch('/api/v1/sandbox/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(wizardConfig),
				signal: abortControllerRef.current.signal
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `Server error: ${response.status}`);
			}

			const data: GenerateResponse = await response.json();

			if (data.success) {
				setGeneratedFiles(data.files);
				setCliCommand(data.cliCommand);
				setCliOutput(data.cliOutput);
				setPageState('success');
			} else {
				throw new Error(data.message || 'Generation failed');
			}
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') {
				return;
			}
			console.error('Generation error:', err);
			setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
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

	const handleDownloadZip = async () => {
		if (!config) return;

		try {
			const response = await fetch('/api/v1/sandbox/download', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ projectName: config.projectName })
			});

			if (!response.ok) {
				throw new Error('Failed to download ZIP');
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${config.projectName}.zip`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (err) {
			console.error('Download error:', err);
			alert('Failed to download ZIP file');
		}
	};

	return (
		<main
			style={{
				minHeight: '100vh',
				padding: '2rem'
			}}
		>
			<div
				style={{
					maxWidth: '1200px',
					margin: '0 auto'
				}}
			>
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
						steps={loadingSteps}
						onCancel={handleCancel}
					/>
				)}

				{pageState === 'success' && config !== null && (
					<FileViewer
						themeSprings={themeSprings}
						files={generatedFiles}
						projectName={config.projectName}
						cliCommand={cliCommand}
						cliOutput={cliOutput}
						onStartOver={handleStartOver}
						onDownloadZip={handleDownloadZip}
					/>
				)}

				{pageState === 'error' && (
					<ErrorDisplay
						themeSprings={themeSprings}
						errorMessage={errorMessage}
						onRetry={handleStartOver}
					/>
				)}
			</div>
		</main>
	);
}