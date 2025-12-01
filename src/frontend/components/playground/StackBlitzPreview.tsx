import { animated } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';
import { ThemeProps } from '../../../types/springTypes';
declare global {
	interface Window {
		StackBlitzSDK: any;
	}
}
interface StackBlitzProject {
	title: string;
	description: string;
	template: 'node' | 'javascript' | 'typescript';
	files: Record<string, string>;
	settings?: {
		compile?: {
			trigger?: 'auto' | 'keystroke' | 'save';
			clearConsole?: boolean;
		};
	};
}
interface StackBlitzPreviewProps extends ThemeProps {
	project: StackBlitzProject;
	onReset: () => void;
}
export const StackBlitzPreview = ({ project, onReset, themeSprings }: StackBlitzPreviewProps) => {
	const embedContainerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isEmbedded, setIsEmbedded] = useState(false);
	useEffect(() => {
		let isMounted = true;
		const embedProject = async () => {
			if (!embedContainerRef.current || isEmbedded) return;
			try {
				setIsLoading(true);
				setError(null);
				let sdk = window.StackBlitzSDK;
				if (!sdk) {
					await new Promise<void>((resolve, reject) => {
						const script = document.createElement('script');
						script.src = 'https://unpkg.com/@stackblitz/sdk@1/bundles/sdk.umd.js';
						script.async = true;
						script.onload = () => resolve();
						script.onerror = () => reject(new Error('Failed to load StackBlitz SDK'));
						document.head.appendChild(script);
					});
					sdk = window.StackBlitzSDK;
				}
				if (!sdk) {
					throw new Error('StackBlitz SDK not available');
				}
				if (!isMounted) return;
				if (embedContainerRef.current) {
					embedContainerRef.current.innerHTML = '';
				}
				await sdk.embedProject(
					embedContainerRef.current,
					{
						title: project.title,
						description: project.description,
						template: project.template,
						files: project.files,
						settings: project.settings
					},
					{
						height: 500,
						openFile: 'README.md,src/backend/server.ts',
						view: 'default', 
						hideNavigation: false,
						hideDevTools: false,
						devToolsHeight: 150,
						terminalHeight: 50
					}
				);
				if (isMounted) {
					setIsEmbedded(true);
					setIsLoading(false);
				}
			} catch (err) {
				console.error('StackBlitz embed error:', err);
				if (isMounted) {
					setError(err instanceof Error ? err.message : 'Failed to load StackBlitz preview');
					setIsLoading(false);
				}
			}
		};
		embedProject();
		return () => {
			isMounted = false;
		};
	}, [project, isEmbedded]);
	const handleOpenInNewTab = () => {
		try {
			const sdk = window.StackBlitzSDK;
			if (sdk) {
				sdk.openProject(
					{
						title: project.title,
						description: project.description,
						template: project.template,
						files: project.files,
						settings: project.settings
					},
					{
						newWindow: true,
						openFile: 'README.md'
					}
				);
			}
		} catch (err) {
			console.error('Failed to open in new tab:', err);
			alert('Please use the "Open in New Tab" button inside the StackBlitz editor');
		}
	};
	const handleRetry = () => {
		setIsEmbedded(false);
		setError(null);
		setIsLoading(true);
	};
	return (
		<animated.div style={{
			marginTop: '1.5rem',
			padding: '1.5rem',
			backgroundColor: 'rgba(0, 0, 0, 0.3)',
			borderRadius: '12px',
			border: '1px solid rgba(255, 255, 255, 0.1)'
		}}>
			<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginBottom: '1rem',
				flexWrap: 'wrap',
				gap: '0.75rem'
			}}>
				<div>
					<h4 style={{
						fontSize: '1.2rem',
						fontWeight: 600,
						margin: 0,
						marginBottom: '0.25rem',
						display: 'flex',
						alignItems: 'center',
						gap: '0.5rem'
					}}>
						Your Project is Live!
						<span style={{
							fontSize: '0.75rem',
							fontWeight: 500,
							padding: '0.2rem 0.5rem',
							backgroundColor: '#1389fd',
							borderRadius: '4px',
							color: 'white'
						}}>
							StackBlitz
						</span>
					</h4>
					<p style={{
						fontSize: '0.85rem',
						opacity: 0.8,
						margin: 0
					}}>
						Edit code and see changes live in the preview panel
					</p>
				</div>

				<div style={{
					display: 'flex',
					gap: '0.5rem',
					flexWrap: 'wrap'
				}}>
					<button
						onClick={handleOpenInNewTab}
						style={{
							padding: '0.5rem 1rem',
							backgroundColor: '#1389fd',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							fontSize: '0.9rem',
							fontWeight: 500,
							cursor: 'pointer',
							transition: 'background-color 0.2s',
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem'
						}}
						onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0d6efd'}
						onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1389fd'}
					>
						Open in New Tab →
					</button>
					<button
						onClick={onReset}
						style={{
							padding: '0.5rem 1rem',
							backgroundColor: '#6b7280',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							fontSize: '0.9rem',
							fontWeight: 500,
							cursor: 'pointer',
							transition: 'background-color 0.2s'
						}}
						onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
						onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
					>
						New Project
					</button>
				</div>
			</div>
			{isLoading && (
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '500px',
					backgroundColor: '#1e1e1e',
					borderRadius: '8px',
					gap: '1rem'
				}}>
					<div style={{
						width: '50px',
						height: '50px',
						border: '3px solid rgba(255,255,255,0.1)',
						borderTopColor: '#1389fd',
						borderRadius: '50%',
						animation: 'spin 1s linear infinite'
					}} />
					<p style={{ opacity: 0.8, textAlign: 'center' }}>
						Loading StackBlitz editor...<br />
						<span style={{ fontSize: '0.85rem', opacity: 0.6 }}>
							This may take a few seconds
						</span>
					</p>
				</div>
			)}
			{error && (
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '300px',
					backgroundColor: 'rgba(239, 68, 68, 0.1)',
					border: '1px solid rgba(239, 68, 68, 0.3)',
					borderRadius: '8px',
					padding: '2rem',
					textAlign: 'center'
				}}>
					<div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
					<h5 style={{ margin: 0, marginBottom: '0.5rem', color: '#ef4444' }}>
						Failed to Load Preview
					</h5>
					<p style={{ opacity: 0.8, marginBottom: '1rem', fontSize: '0.9rem' }}>
						{error}
					</p>
					<button
						onClick={handleRetry}
						style={{
							padding: '0.5rem 1.5rem',
							backgroundColor: '#ef4444',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							fontSize: '0.9rem',
							fontWeight: 500,
							cursor: 'pointer'
						}}
					>
						Try Again
					</button>
				</div>
			)}
			<div
				ref={embedContainerRef}
				style={{
					display: isLoading || error ? 'none' : 'block',
					borderRadius: '8px',
					overflow: 'hidden',
					backgroundColor: '#1e1e1e',
					minHeight: '500px'
				}}
			/>
			{!isLoading && !error && (
				<div style={{
					marginTop: '1rem',
					padding: '1rem',
					backgroundColor: 'rgba(19, 137, 253, 0.1)',
					border: '1px solid rgba(19, 137, 253, 0.3)',
					borderRadius: '8px'
				}}>
					<h5 style={{
						fontSize: '0.95rem',
						fontWeight: 600,
						margin: 0,
						marginBottom: '0.5rem',
						color: '#60a5fa'
					}}>
						Quick Tips:
					</h5>
					<ul style={{
						fontSize: '0.85rem',
						opacity: 0.9,
						margin: 0,
						paddingLeft: '1.25rem',
						lineHeight: 1.6
					}}>
						<li>Click files in the left sidebar to edit them</li>
						<li>Changes appear instantly in the preview panel</li>
						<li>Click "Open in New Tab" for the full StackBlitz experience</li>
						<li>Fork the project to save it to your StackBlitz account</li>
						<li>Download the project to run locally with Bun</li>
					</ul>
				</div>
			)}
			<style>{`
				@keyframes spin {
					to { transform: rotate(360deg); }
				}
			`}</style>
		</animated.div>
	);
};