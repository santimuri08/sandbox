import { animated } from '@react-spring/web';
import { useState } from 'react';
import { ThemeProps } from '../../../types/springTypes';
interface SandboxFiles {
	[path: string]: {
		content: string;
	};
}
interface ProjectFilesViewerProps extends ThemeProps {
	files: SandboxFiles;
	projectName: string;
	onReset: () => void;
}
export const ProjectFilesViewer = ({ files, projectName, onReset, themeSprings }: ProjectFilesViewerProps) => {
	const [selectedFile, setSelectedFile] = useState('README.md');
	const fileList = Object.keys(files).sort();
	const currentFileContent = files[selectedFile]?.content || '';
	const handleDownload = () => {
		let allContent = `# ${projectName}\n\n`;
		allContent += `Generated with AbsoluteJS Playground\n\n`;
		allContent += `## Files Generated:\n\n`;
		for (const [path, file] of Object.entries(files)) {
			allContent += `\n\n=== ${path} ===\n\n`;
			allContent += file.content;
		}
		const blob = new Blob([allContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${projectName}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
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
						marginBottom: '0.25rem'
					}}>
						Your Project Files are Ready!
					</h4>
					<p style={{
						fontSize: '0.85rem',
						opacity: 0.8,
						margin: 0
					}}>
						Browse through the generated files below
					</p>
				</div>
				<div style={{
					display: 'flex',
					gap: '0.5rem',
					flexWrap: 'wrap'
				}}>
					<button
						onClick={handleDownload}
						style={{
							padding: '0.5rem 1rem',
							backgroundColor: '#10b981',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							fontSize: '0.9rem',
							fontWeight: 500,
							cursor: 'pointer',
							transition: 'background-color 0.2s',
							whiteSpace: 'nowrap'
						}}
						onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
						onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
					>
						Download All Files
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
							transition: 'background-color 0.2s',
							whiteSpace: 'nowrap'
						}}
						onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
						onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
					>
						New Project
					</button>
				</div>
			</div>
			<div style={{
				display: 'grid',
				gridTemplateColumns: '250px 1fr',
				gap: '1rem',
				backgroundColor: '#1a1a1a',
				borderRadius: '8px',
				overflow: 'hidden',
				minHeight: '500px'
			}}>
				{/* File list */}
				<div style={{
					backgroundColor: '#0d1117',
					padding: '1rem',
					overflowY: 'auto',
					borderRight: '1px solid rgba(255, 255, 255, 0.1)'
				}}>
					<h5 style={{
						fontSize: '0.85rem',
						fontWeight: 600,
						marginBottom: '0.75rem',
						opacity: 0.7,
						textTransform: 'uppercase'
					}}>
						Files ({fileList.length})
					</h5>
					{fileList.map((file) => (
						<button
							key={file}
							onClick={() => setSelectedFile(file)}
							style={{
								display: 'block',
								width: '100%',
								padding: '0.5rem 0.75rem',
								marginBottom: '0.25rem',
								backgroundColor: selectedFile === file ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
								border: selectedFile === file ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
								borderRadius: '4px',
								color: 'inherit',
								textAlign: 'left',
								fontSize: '0.85rem',
								cursor: 'pointer',
								transition: 'all 0.2s',
								fontFamily: 'monospace'
							}}
							onMouseOver={(e) => {
								if (selectedFile !== file) {
									e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
								}
							}}
							onMouseOut={(e) => {
								if (selectedFile !== file) {
									e.currentTarget.style.backgroundColor = 'transparent';
								}
							}}
						>
							{file.includes('.') ? `${file}` : `${file}`}
						</button>
					))}
				</div>
				<div style={{
					padding: '1rem',
					overflowY: 'auto'
				}}>
					<div style={{
						marginBottom: '0.75rem',
						paddingBottom: '0.75rem',
						borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
					}}>
						<h5 style={{
							fontSize: '0.9rem',
							fontWeight: 600,
							margin: 0,
							fontFamily: 'monospace',
							color: '#60a5fa'
						}}>
							{selectedFile}
						</h5>
					</div>
					<pre style={{
						backgroundColor: '#0d1117',
						padding: '1rem',
						borderRadius: '6px',
						overflow: 'auto',
						fontFamily: 'monospace',
						fontSize: '0.85rem',
						lineHeight: 1.6,
						margin: 0,
						whiteSpace: 'pre-wrap',
						wordBreak: 'break-word'
					}}>
						{currentFileContent}
					</pre>
				</div>
			</div>
			<div style={{
				marginTop: '1rem',
				padding: '1rem',
				backgroundColor: 'rgba(59, 130, 246, 0.1)',
				border: '1px solid rgba(59, 130, 246, 0.3)',
				borderRadius: '8px'
			}}>
				<h5 style={{
					fontSize: '0.95rem',
					fontWeight: 600,
					margin: 0,
					marginBottom: '0.5rem',
					color: '#60a5fa'
				}}>
					💡 Next Steps:
				</h5>
				<ul style={{
					fontSize: '0.85rem',
					opacity: 0.9,
					margin: 0,
					paddingLeft: '1.25rem',
					lineHeight: 1.6
				}}>
					<li>Click "Download All Files" to get all project files</li>
					<li>Create a new folder for your project</li>
					<li>Copy the files into your project folder</li>
					<li>Install Bun: <code style={{fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.3rem', borderRadius: '3px'}}>curl -fsSL https://bun.sh/install | bash</code></li>
					<li>Run: <code style={{fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.3rem', borderRadius: '3px'}}>bun install && bun run dev</code></li>
				</ul>
			</div>
		</animated.div>
	);
};