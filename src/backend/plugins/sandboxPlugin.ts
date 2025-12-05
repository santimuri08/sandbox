import { useState, useEffect } from 'react';
import type { ThemeProps } from '../../../types/springTypes';
import { CopyButton } from '../utils/CopyButton';
import { PrismPlus } from '../utils/PrismPlus';

// ============================================================================
// TYPES
// ============================================================================

interface GeneratedFile {
	path: string;
	content: string;
}

interface FileViewerProps extends ThemeProps {
	files: GeneratedFile[];
	projectName: string;
	cliCommand: string;
	cliOutput: string;
	onStartOver: () => void;
	onFilesChange?: (files: GeneratedFile[]) => void;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const triggerDownload = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	URL.revokeObjectURL(url);
	document.body.removeChild(link);
};

const downloadProjectZip = async (projectName: string) => {
	const res = await fetch('/api/v1/sandbox/download', {
		body: JSON.stringify({ projectName }),
		headers: { 'Content-Type': 'application/json' },
		method: 'POST'
	});

	if (!res.ok) throw new Error('Failed to download zip');
	const blob = await res.blob();
	triggerDownload(blob, `${projectName}.zip`);
};

// Call backend to create CodeSandbox (avoids CORS)
const createCodeSandbox = async (files: GeneratedFile[], projectName: string) => {
	const response = await fetch('/api/v1/sandbox/codesandbox', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ files, projectName })
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || `Server error: ${response.status}`);
	}

	const data = await response.json();
	return data.sandbox_id;
};

// ============================================================================
// COMPONENTS
// ============================================================================

interface CliSectionProps extends ThemeProps {
	cliCommand: string;
	cliOutput: string;
}

const CliSection = ({ cliCommand, cliOutput, themeSprings }: CliSectionProps) => {
	const [showOutput, setShowOutput] = useState(false);

	return (
		<section style={{
			backgroundColor: 'rgba(0, 0, 0, 0.4)',
			border: '1px solid rgba(255, 255, 255, 0.1)',
			borderRadius: '8px',
			marginBottom: '1rem',
			padding: '1rem'
		}}>
			<header style={{
				alignItems: 'center',
				display: 'flex',
				justifyContent: 'space-between',
				marginBottom: '0.5rem'
			}}>
				<div style={{ alignItems: 'center', display: 'flex', gap: '0.75rem' }}>
					<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
						CLI Command
					</span>
					<CopyButton text={cliCommand} />
				</div>
				<button
					onClick={() => setShowOutput(!showOutput)}
					type="button"
					style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.75rem' }}
				>
					{showOutput ? 'Hide Output ▲' : 'Show Output ▼'}
				</button>
			</header>
			<PrismPlus codeString={cliCommand} language="bash" showLineNumbers={false} themeSprings={themeSprings} />
			{showOutput && (
				<pre style={{
					backgroundColor: 'rgba(0, 0, 0, 0.3)',
					borderRadius: '4px',
					color: 'rgba(255, 255, 255, 0.8)',
					fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
					fontSize: '0.75rem',
					margin: '1rem 0 0 0',
					maxHeight: '200px',
					overflowY: 'auto',
					padding: '1rem',
					whiteSpace: 'pre-wrap'
				}}>
					{cliOutput || 'No output'}
				</pre>
			)}
		</section>
	);
};

interface HeaderProps {
	files: GeneratedFile[];
	projectName: string;
	onStartOver: () => void;
}

const Header = ({ files, projectName, onStartOver }: HeaderProps) => {
	const handleDownload = async () => {
		try {
			await downloadProjectZip(projectName);
		} catch (err) {
			console.error('Download error:', err);
			alert('Failed to download ZIP');
		}
	};

	return (
		<header style={{
			alignItems: 'center',
			display: 'flex',
			flexWrap: 'wrap',
			gap: '1rem',
			justifyContent: 'space-between',
			marginBottom: '1rem'
		}}>
			<section>
				<h2 style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>
					Project Generated Successfully
				</h2>
				<p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0 0 0' }}>
					{files.length} files in <code style={{ color: '#10b981' }}>{projectName}/</code>
				</p>
			</section>
			<nav style={{ display: 'flex', gap: '0.75rem' }}>
				<button
					onClick={handleDownload}
					type="button"
					style={{
						backgroundColor: '#10b981',
						border: 'none',
						borderRadius: '8px',
						color: '#fff',
						cursor: 'pointer',
						fontSize: '0.875rem',
						fontWeight: 600,
						padding: '0.625rem 1.25rem'
					}}
				>
					Download ZIP
				</button>
				<button
					onClick={onStartOver}
					type="button"
					style={{
						backgroundColor: 'transparent',
						border: '1px solid rgba(255, 255, 255, 0.2)',
						borderRadius: '8px',
						color: '#fff',
						cursor: 'pointer',
						fontSize: '0.875rem',
						fontWeight: 500,
						padding: '0.625rem 1.25rem'
					}}
				>
					Start Over
				</button>
			</nav>
		</header>
	);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const FileViewer = ({
	files,
	projectName,
	cliCommand,
	cliOutput,
	onStartOver,
	themeSprings
}: FileViewerProps) => {
	const [sandboxId, setSandboxId] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!files.length) return;

		const loadSandbox = async () => {
			setIsLoading(true);
			setError('');

			try {
				const id = await createCodeSandbox(files, projectName);
				setSandboxId(id);
			} catch (err) {
				console.error('Failed to create CodeSandbox:', err);
				setError('Failed to create CodeSandbox. Please try again.');
			} finally {
				setIsLoading(false);
			}
		};

		loadSandbox();
	}, [files, projectName]);

	const handleRetry = async () => {
		if (!files.length) return;

		setIsLoading(true);
		setError('');

		try {
			const id = await createCodeSandbox(files, projectName);
			setSandboxId(id);
		} catch (err) {
			console.error('Failed to create CodeSandbox:', err);
			setError('Failed to create CodeSandbox. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const sandboxUrl = sandboxId 
		? `https://codesandbox.io/embed/${sandboxId}?fontsize=14&hidenavigation=0&theme=dark&view=split`
		: '';

	return (
		<article style={{ marginTop: '2rem' }}>
			<Header
				files={files}
				projectName={projectName}
				onStartOver={onStartOver}
			/>

			<CliSection
				cliCommand={cliCommand}
				cliOutput={cliOutput}
				themeSprings={themeSprings}
			/>

			{/* Full CodeSandbox Embed */}
			<section style={{
				backgroundColor: '#1e1e1e',
				border: '1px solid #333',
				borderRadius: '8px',
				overflow: 'hidden',
				position: 'relative'
			}}>
				{isLoading && (
					<div style={{
						alignItems: 'center',
						backgroundColor: '#1e1e1e',
						display: 'flex',
						flexDirection: 'column',
						gap: '1rem',
						height: '700px',
						justifyContent: 'center',
						left: 0,
						position: 'absolute',
						top: 0,
						width: '100%',
						zIndex: 10
					}}>
						<div style={{
							animation: 'spin 1s linear infinite',
							border: '3px solid #333',
							borderRadius: '50%',
							borderTopColor: '#FFD700',
							height: '40px',
							width: '40px'
						}} />
						<span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
							Creating CodeSandbox...
						</span>
					</div>
				)}

				{error && (
					<div style={{
						alignItems: 'center',
						backgroundColor: '#1e1e1e',
						color: '#f87171',
						display: 'flex',
						flexDirection: 'column',
						gap: '0.75rem',
						height: '700px',
						justifyContent: 'center',
						padding: '2rem',
						textAlign: 'center'
					}}>
						<span style={{ fontSize: '2rem' }}>⚠️</span>
						<span style={{ fontSize: '1rem' }}>{error}</span>
						<button
							onClick={handleRetry}
							type="button"
							style={{
								backgroundColor: '#3b82f6',
								border: 'none',
								borderRadius: '6px',
								color: '#fff',
								cursor: 'pointer',
								fontSize: '0.875rem',
								marginTop: '0.5rem',
								padding: '0.5rem 1rem'
							}}
						>
							Try Again
						</button>
					</div>
				)}

				{sandboxUrl && !error && !isLoading && (
					<iframe
						src={sandboxUrl}
						style={{
							border: 'none',
							height: '700px',
							width: '100%'
						}}
						title="CodeSandbox"
						allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
						sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
					/>
				)}
			</section>

			<style>{`
				@keyframes spin {
					to { transform: rotate(360deg); }
				}
			`}</style>
		</article>
	);
};
