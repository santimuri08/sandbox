import { useState, useMemo, useEffect } from 'react';
import type { ThemeProps } from '../../../types/springTypes';
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
	onDownloadZip: () => void;
}
interface FileTreeNode {
	name: string;
	path: string;
	isDirectory: boolean;
	children: FileTreeNode[];
	content: string;
}
function buildFileTree(files: GeneratedFile[]): FileTreeNode[] {
	const root: FileTreeNode[] = [];
	for (const file of files) {
		const parts = file.path.split('/').filter(Boolean);
		let currentLevel = root;
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i] as string;
			const isFile = i === parts.length - 1;
			const existingNode = currentLevel.find(n => n.name === part);
			if (existingNode) {
				if (!isFile) {
					currentLevel = existingNode.children;
				}
			} else {
				const newNode: FileTreeNode = {
					name: part,
					path: parts.slice(0, i + 1).join('/'),
					isDirectory: !isFile,
					children: [],
					content: isFile ? (file.content ?? '') : ''
				};
				currentLevel.push(newNode);
				if (!isFile) {
					currentLevel = newNode.children;
				}
			}
		}
	}
	const sortNodes = (nodes: FileTreeNode[]): FileTreeNode[] => {
		return nodes
			.sort((a, b) => {
				if (a.isDirectory && !b.isDirectory) return -1;
				if (!a.isDirectory && b.isDirectory) return 1;
				return a.name.localeCompare(b.name);
			})
			.map(node => ({
				...node,
				children: sortNodes(node.children)
			}));
	};
	return sortNodes(root);
}
function getLanguage(filename: string): string {
	const ext = filename.split('.').pop() ?? '';
	switch (ext.toLowerCase()) {
		case 'ts':
		case 'tsx':
			return 'typescript';
		case 'js':
		case 'jsx':
			return 'javascript';
		case 'json':
			return 'json';
		case 'css':
			return 'css';
		case 'html':
			return 'html';
		case 'md':
			return 'markdown';
		default:
			return 'plaintext';
	}
}
function highlightCode(content: string, language: string): string {
	const safeContent = content ?? '';
	let escaped = safeContent
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
	if (language === 'json') {
		return escaped
			.replace(/"([^"]+)":/g, '<span style="color: #9cdcfe;">"$1"</span>:')
			.replace(/: "([^"]+)"/g, ': <span style="color: #ce9178;">"$1"</span>')
			.replace(/: (\d+)/g, ': <span style="color: #b5cea8;">$1</span>')
			.replace(/: (true|false|null)/g, ': <span style="color: #569cd6;">$1</span>');
	}
	if (language === 'typescript' || language === 'javascript') {
		const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'async', 'await', 'new', 'class', 'interface', 'type', 'extends', 'implements'];
		escaped = escaped.replace(/'([^']+)'/g, '<span style="color: #ce9178;">\'$1\'</span>');
		escaped = escaped.replace(/"([^"]+)"/g, '<span style="color: #ce9178;">"$1"</span>');
		for (const keyword of keywords) {
			const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
			escaped = escaped.replace(regex, '<span style="color: #569cd6;">$1</span>');
		}
		escaped = escaped.replace(/(\/\/.*)/g, '<span style="color: #6a9955;">$1</span>');
		return escaped;
	}
	return escaped;
}
interface FileTreeItemProps {
	node: FileTreeNode;
	depth: number;
	selectedPath: string;
	expandedPaths: Set<string>;
	onSelect: (node: FileTreeNode) => void;
	onToggle: (path: string) => void;
}
function FileTreeItem(props: FileTreeItemProps): JSX.Element {
	const { node, depth, selectedPath, expandedPaths, onSelect, onToggle } = props;
	const isExpanded = expandedPaths.has(node.path);
	const isSelected = selectedPath === node.path;
	const handleClick = () => {
		if (node.isDirectory) {
			onToggle(node.path);
		} else {
			onSelect(node);
		}
	};
	const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isSelected) {
			e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
		}
	};
	const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isSelected) {
			e.currentTarget.style.backgroundColor = 'transparent';
		}
	};
	return (
		<div>
			<div
				onClick={handleClick}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				style={{
					display: 'flex',
					alignItems: 'center',
					padding: '0.35rem 0.5rem',
					paddingLeft: `${depth * 1.25 + 0.5}rem`,
					cursor: 'pointer',
					backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
					borderLeft: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
					transition: 'background-color 0.15s ease'
				}}
			>
				<span style={{
					color: node.isDirectory ? '#fff' : 'rgba(255, 255, 255, 0.8)',
					fontSize: '0.875rem',
					fontFamily: 'monospace'
				}}>
					{node.name}
				</span>
			</div>
			{node.isDirectory && isExpanded && (
				<div>
					{node.children.map(child => (
						<FileTreeItem
							key={child.path}
							node={child}
							depth={depth + 1}
							selectedPath={selectedPath}
							expandedPaths={expandedPaths}
							onSelect={onSelect}
							onToggle={onToggle}
						/>
					))}
				</div>
			)}
		</div>
	);
}
export function FileViewer(props: FileViewerProps): JSX.Element {
	const { files, projectName, cliCommand, cliOutput, onStartOver, onDownloadZip } = props;
	const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(null);
	const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['src']));
	const [showCliOutput, setShowCliOutput] = useState(false);
	const fileTree = useMemo(() => buildFileTree(files), [files]);
	useEffect(() => {
		if (selectedFile === null && files.length > 0) {
			const findFirstFile = (nodes: FileTreeNode[]): FileTreeNode | null => {
				for (const node of nodes) {
					if (!node.isDirectory) return node;
					const found = findFirstFile(node.children);
					if (found) return found;
				}
				return null;
			};
			const first = findFirstFile(fileTree);
			if (first !== null) {
				setSelectedFile(first);
			}
		}
	}, [fileTree, files.length, selectedFile]);
	const handleToggle = (path: string) => {
		setExpandedPaths(prev => {
			const next = new Set(prev);
			if (next.has(path)) {
				next.delete(path);
			} else {
				next.add(path);
			}
			return next;
		});
	};
	const handleSelectFile = (node: FileTreeNode) => {
		setSelectedFile(node);
	};
	const toggleCliOutput = () => {
		setShowCliOutput(prev => !prev);
	};
	const selectedPath: string = selectedFile !== null ? selectedFile.path : '';
	const selectedFileName: string = selectedFile !== null ? selectedFile.name : '';
	const selectedFileContent: string = selectedFile !== null ? selectedFile.content : '';
	return (
		<div style={{ marginTop: '2rem' }}>
			<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginBottom: '1rem',
				flexWrap: 'wrap',
				gap: '1rem'
			}}>
				<div>
					<h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>
						Project Generated Successfully
					</h2>
					<p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.25rem 0 0 0' }}>
						{files.length} files created in <code style={{ color: '#10b981' }}>{projectName}/</code>
					</p>
				</div>
				<div style={{ display: 'flex', gap: '0.75rem' }}>
					<button
						onClick={onDownloadZip}
						style={{
							padding: '0.625rem 1.25rem',
							borderRadius: '8px',
							border: 'none',
							backgroundColor: '#10b981',
							color: '#fff',
							cursor: 'pointer',
							fontSize: '0.875rem',
							fontWeight: 600,
							display: 'flex',
							alignItems: 'center',
							gap: '0.5rem'
						}}
					>
						Download ZIP
					</button>
					<button
						onClick={onStartOver}
						style={{
							padding: '0.625rem 1.25rem',
							borderRadius: '8px',
							border: '1px solid rgba(255, 255, 255, 0.2)',
							backgroundColor: 'transparent',
							color: '#fff',
							cursor: 'pointer',
							fontSize: '0.875rem',
							fontWeight: 500
						}}
					>
						Start Over
					</button>
				</div>
			</div>
			<div style={{
				backgroundColor: 'rgba(0, 0, 0, 0.4)',
				borderRadius: '8px',
				padding: '1rem',
				marginBottom: '1rem',
				border: '1px solid rgba(255, 255, 255, 0.1)'
			}}>
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '0.5rem'
				}}>
					<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
						CLI Command Executed
					</span>
					<button
						onClick={toggleCliOutput}
						style={{
							background: 'none',
							border: 'none',
							color: '#3b82f6',
							cursor: 'pointer',
							fontSize: '0.75rem'
						}}
					>
						{showCliOutput ? 'Hide Output ▲' : 'Show Output ▼'}
					</button>
				</div>
				<code style={{
					color: '#10b981',
					fontFamily: 'monospace',
					fontSize: '0.875rem',
					wordBreak: 'break-all'
				}}>
					{cliCommand}
				</code>
				{showCliOutput && (
					<div style={{
						marginTop: '1rem',
						padding: '1rem',
						backgroundColor: 'rgba(0, 0, 0, 0.3)',
						borderRadius: '4px',
						maxHeight: '200px',
						overflowY: 'auto'
					}}>
						<pre style={{
							margin: 0,
							fontFamily: 'monospace',
							fontSize: '0.75rem',
							color: 'rgba(255, 255, 255, 0.8)',
							whiteSpace: 'pre-wrap'
						}}>
							{cliOutput || 'No output captured'}
						</pre>
					</div>
				)}
			</div>
			<div style={{
				display: 'grid',
				gridTemplateColumns: '280px 1fr',
				gap: '1px',
				backgroundColor: 'rgba(255, 255, 255, 0.1)',
				borderRadius: '8px',
				overflow: 'hidden',
				border: '1px solid rgba(255, 255, 255, 0.1)',
				minHeight: '500px'
			}}>
				<div style={{
					backgroundColor: 'rgba(30, 30, 30, 0.9)',
					overflowY: 'auto',
					maxHeight: '600px'
				}}>
					<div style={{
						padding: '0.75rem 1rem',
						borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
						color: 'rgba(255, 255, 255, 0.6)',
						fontSize: '0.75rem',
						textTransform: 'uppercase',
						letterSpacing: '0.05em',
						fontWeight: 600
					}}>
						{projectName}
					</div>
					<div style={{ padding: '0.5rem 0' }}>
						{fileTree.map(node => (
							<FileTreeItem
								key={node.path}
								node={node}
								depth={0}
								selectedPath={selectedPath}
								expandedPaths={expandedPaths}
								onSelect={handleSelectFile}
								onToggle={handleToggle}
							/>
						))}
					</div>
				</div>
				<div style={{
					backgroundColor: 'rgba(20, 20, 20, 0.95)',
					overflowY: 'auto',
					maxHeight: '600px'
				}}>
					{selectedFile !== null ? (
						<>
							<div style={{
								padding: '0.75rem 1rem',
								borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
								color: '#fff',
								fontSize: '0.875rem',
								fontFamily: 'monospace',
								display: 'flex',
								alignItems: 'center',
								gap: '0.5rem'
							}}>
							</div>
							<pre 
								style={{
									margin: 0,
									padding: '1rem',
									fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
									fontSize: '0.8125rem',
									lineHeight: '1.6',
									color: '#d4d4d4',
									whiteSpace: 'pre',
									overflowX: 'auto'
								}}
								dangerouslySetInnerHTML={{
									__html: highlightCode(selectedFileContent, getLanguage(selectedFileName))
								}}
							/>
						</>
					) : (
						<div style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							height: '100%',
							color: 'rgba(255, 255, 255, 0.4)'
						}}>
							Select a file to view its contents
						</div>
					)}
				</div>
			</div>
			<div style={{
				marginTop: '1.5rem',
				padding: '1.25rem',
				backgroundColor: 'rgba(59, 130, 246, 0.1)',
				borderRadius: '8px',
				border: '1px solid rgba(59, 130, 246, 0.2)'
			}}>
				<h3 style={{ color: '#fff', margin: '0 0 0.75rem 0', fontSize: '1rem' }}>
					Next Steps
				</h3>
				<ol style={{
					margin: 0,
					paddingLeft: '1.25rem',
					color: 'rgba(255, 255, 255, 0.8)',
					fontSize: '0.875rem',
					lineHeight: '1.8'
				}}>
					<li>Download the ZIP file using the button above</li>
					<li>Extract the archive to your desired location</li>
					<li>Open a terminal and navigate to the project folder</li>
					<li>Run <code style={{ color: '#10b981', backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>bun dev</code> to start the development server</li>
				</ol>
			</div>
		</div>
	);
}