import { useState, useMemo, useEffect, type MouseEvent } from 'react';
import type { ThemeProps } from '../../../types/springTypes';

const DEPTH_INDENT_REM = 1.25;
const BASE_PADDING_REM = 0.5;

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
}

const triggerFileDownload = (blob: Blob, filename: string) => {
	const url = window.URL.createObjectURL(blob);
	const linkElement = document.createElement('a');

	linkElement.href = url;
	linkElement.download = filename;
	document.body.appendChild(linkElement);
	linkElement.click();
	window.URL.revokeObjectURL(url);
	document.body.removeChild(linkElement);
};

const downloadProjectZip = async (projectName: string) => {
	const response = await fetch('/api/v1/sandbox/download', {
		body: JSON.stringify({ projectName }),
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST'
	});

	if (!response.ok) {
		throw new Error('Failed to download zip file');
	}

	const blob = await response.blob();
	triggerFileDownload(blob, `${projectName}.zip`);
};

interface FileTreeNode {
	name: string;
	path: string;
	isDirectory: boolean;
	children: FileTreeNode[];
	content: string;
}

interface FileTreeItemProps {
	node: FileTreeNode;
	depth: number;
	selectedPath: string;
	expandedPaths: Set<string>;
	onSelect: (node: FileTreeNode) => void;
	onToggle: (path: string) => void;
}

const findExistingNode = (nodes: FileTreeNode[], name: string) =>
	nodes.find((node) => node.name === name);

const createNewNode = (
	part: string,
	pathParts: string[],
	partIndex: number,
	isFile: boolean,
	fileContent: string
): FileTreeNode => ({
	children: [],
	content: isFile ? (fileContent ?? '') : '',
	isDirectory: !isFile,
	name: part,
	path: pathParts.slice(0, partIndex + 1).join('/')
});

const processPathPart = (
	currentLevel: FileTreeNode[],
	part: string,
	pathParts: string[],
	partIndex: number,
	isFile: boolean,
	fileContent: string
) => {
	const existingNode = findExistingNode(currentLevel, part);

	if (existingNode) {
		return isFile ? currentLevel : existingNode.children;
	}

	const newNode = createNewNode(part, pathParts, partIndex, isFile, fileContent);
	currentLevel.push(newNode);

	return isFile ? currentLevel : newNode.children;
};

const addFileToTree = (root: FileTreeNode[], file: GeneratedFile) => {
	const parts = file.path.split('/').filter(Boolean);
	let currentLevel = root;

	parts.forEach((part, partIndex) => {
		const isFile = partIndex === parts.length - 1;
		currentLevel = processPathPart(currentLevel, part, parts, partIndex, isFile, file.content);
	});
};

const compareNodes = (nodeA: FileTreeNode, nodeB: FileTreeNode) => {
	if (nodeA.isDirectory && !nodeB.isDirectory) {
		return -1;
	}

	if (!nodeA.isDirectory && nodeB.isDirectory) {
		return 1;
	}

	return nodeA.name.localeCompare(nodeB.name);
};

// eslint-disable-next-line absolute/no-explicit-return-type -- Required for recursive function
const sortNodes = (nodes: FileTreeNode[]): FileTreeNode[] =>
	nodes
		.sort(compareNodes)
		.map((node): FileTreeNode => ({
			...node,
			children: sortNodes(node.children)
		}));

const buildFileTree = (files: GeneratedFile[]) => {
	const root: FileTreeNode[] = [];

	files.forEach((file) => addFileToTree(root, file));

	return sortNodes(root);
};

const getLanguage = (filename: string) => {
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
};

// ============================================================================
// HELPER FUNCTIONS - CODE HIGHLIGHTING
// ============================================================================

const escapeHtml = (content: string) =>
	content
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

const highlightJson = (escaped: string) =>
	escaped
		.replace(/"([^"]+)":/g, '<span style="color: #9cdcfe;">"$1"</span>:')
		.replace(/: "([^"]+)"/g, ': <span style="color: #ce9178;">"$1"</span>')
		.replace(/: (\d+)/g, ': <span style="color: #b5cea8;">$1</span>')
		.replace(/: (true|false|null)/g, ': <span style="color: #569cd6;">$1</span>');

const highlightJsKeywords = (escaped: string) => {
	const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'async', 'await', 'new', 'class', 'interface', 'type', 'extends', 'implements'];
	let result = escaped;

	result = result.replace(/'([^']+)'/g, '<span style="color: #ce9178;">\'$1\'</span>');
	result = result.replace(/"([^"]+)"/g, '<span style="color: #ce9178;">"$1"</span>');

	keywords.forEach((keyword) => {
		const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
		result = result.replace(regex, '<span style="color: #569cd6;">$1</span>');
	});

	result = result.replace(/(\/\/.*)/g, '<span style="color: #6a9955;">$1</span>');

	return result;
};

const highlightCode = (content: string, language: string) => {
	const safeContent = content ?? '';
	const escaped = escapeHtml(safeContent);

	if (language === 'json') {
		return highlightJson(escaped);
	}

	if (language === 'typescript' || language === 'javascript') {
		return highlightJsKeywords(escaped);
	}

	return escaped;
};

// eslint-disable-next-line absolute/no-explicit-return-type -- Required for recursive function
const findFirstFileInNodes = (nodes: FileTreeNode[]): FileTreeNode | null => {
	for (const node of nodes) {
		if (!node.isDirectory) {
			return node;
		}

		const found: FileTreeNode | null = findFirstFileInNodes(node.children);

		if (found) {
			return found;
		}
	}

	return null;
};

const FileTreeItem = (props: FileTreeItemProps) => {
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

	const handleMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
		if (!isSelected) {
			event.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
		}
	};

	const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
		if (!isSelected) {
			event.currentTarget.style.backgroundColor = 'transparent';
		}
	};

	const paddingLeft = `${depth * DEPTH_INDENT_REM + BASE_PADDING_REM}rem`;
	const textColor = node.isDirectory ? '#fff' : 'rgba(255, 255, 255, 0.8)';

	return (
		<li style={{ listStyle: 'none' }}>
			<button
				onClick={handleClick}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				type="button"
				style={{
					alignItems: 'center',
					backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
					border: 'none',
					borderLeft: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
					cursor: 'pointer',
					display: 'flex',
					padding: '0.35rem 0.5rem',
					paddingLeft,
					textAlign: 'left',
					transition: 'background-color 0.15s ease',
					width: '100%'
				}}
			>
				<span style={{ fontSize: '0.75rem', marginRight: '0.5rem' }}>
				</span>
				<span style={{
					color: textColor,
					fontFamily: 'monospace',
					fontSize: '0.875rem'
				}}>
					{node.name}
				</span>
			</button>

			{node.isDirectory && isExpanded && (
				<ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
					{node.children.map((child) => (
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
				</ul>
			)}
		</li>
	);
};

export const FileViewer = (props: FileViewerProps) => {
	const { files, projectName, cliCommand, cliOutput, onStartOver } = props;

	const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(null);
	const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['src']));
	const [showCliOutput, setShowCliOutput] = useState(false);

	const fileTree = useMemo(() => buildFileTree(files), [files]);

	useEffect(() => {
		const shouldSelectFirst = selectedFile === null && files.length > 0;

		if (!shouldSelectFirst) {
			return;
		}

		const first = findFirstFileInNodes(fileTree);

		if (first !== null) {
			setSelectedFile(first);
		}
	}, [fileTree, files.length, selectedFile]);

	const handleToggle = (path: string) => {
		setExpandedPaths((prev) => {
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
		setShowCliOutput((prev) => !prev);
	};

	const handleDownloadZip = async () => {
		try {
			await downloadProjectZip(projectName);
		} catch (err) {
			console.error('Download error:', err);
			alert('Failed to download ZIP file');
		}
	};

	const selectedPath = selectedFile !== null ? selectedFile.path : '';
	const selectedFileName = selectedFile !== null ? selectedFile.name : '';
	const selectedFileContent = selectedFile !== null ? selectedFile.content : '';

	return (
		<article style={{ marginTop: '2rem' }}>
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
						{files.length} files created in <code style={{ color: '#10b981' }}>{projectName}/</code>
					</p>
				</section>
				<nav style={{ display: 'flex', gap: '0.75rem' }}>
					<button
						onClick={handleDownloadZip}
						type="button"
						style={{
							alignItems: 'center',
							backgroundColor: '#10b981',
							border: 'none',
							borderRadius: '8px',
							color: '#fff',
							cursor: 'pointer',
							display: 'flex',
							fontSize: '0.875rem',
							fontWeight: 600,
							gap: '0.5rem',
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
					<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
						CLI Command Executed
					</span>
					<button
						onClick={toggleCliOutput}
						type="button"
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
				</header>
				<code style={{
					color: '#10b981',
					fontFamily: 'monospace',
					fontSize: '0.875rem',
					wordBreak: 'break-all'
				}}>
					{cliCommand}
				</code>

				{showCliOutput && (
					<pre style={{
						backgroundColor: 'rgba(0, 0, 0, 0.3)',
						borderRadius: '4px',
						color: 'rgba(255, 255, 255, 0.8)',
						fontFamily: 'monospace',
						fontSize: '0.75rem',
						margin: '1rem 0 0 0',
						maxHeight: '200px',
						overflowY: 'auto',
						padding: '1rem',
						whiteSpace: 'pre-wrap'
					}}>
						{cliOutput || 'No output captured'}
					</pre>
				)}
			</section>

			<section style={{
				backgroundColor: 'rgba(255, 255, 255, 0.1)',
				border: '1px solid rgba(255, 255, 255, 0.1)',
				borderRadius: '8px',
				display: 'grid',
				gap: '1px',
				gridTemplateColumns: '280px 1fr',
				minHeight: '500px',
				overflow: 'hidden'
			}}>

				<aside style={{
					backgroundColor: 'rgba(30, 30, 30, 0.9)',
					maxHeight: '600px',
					overflowY: 'auto'
				}}>
					<header style={{
						borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
						color: 'rgba(255, 255, 255, 0.6)',
						fontSize: '0.75rem',
						fontWeight: 600,
						letterSpacing: '0.05em',
						padding: '0.75rem 1rem',
						textTransform: 'uppercase'
					}}>
						{projectName}
					</header>
					<ul style={{ listStyle: 'none', margin: 0, padding: '0.5rem 0' }}>
						{fileTree.map((node) => (
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
					</ul>
				</aside>

				<section style={{
					backgroundColor: 'rgba(20, 20, 20, 0.95)',
					maxHeight: '600px',
					overflowY: 'auto'
				}}>
					{selectedFile !== null ? (
						<>
							<header style={{
								alignItems: 'center',
								borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
								color: '#fff',
								display: 'flex',
								fontFamily: 'monospace',
								fontSize: '0.875rem',
								gap: '0.5rem',
								padding: '0.75rem 1rem'
							}}>
							</header>
							<pre
								style={{
									color: '#d4d4d4',
									fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
									fontSize: '0.8125rem',
									lineHeight: '1.6',
									margin: 0,
									overflowX: 'auto',
									padding: '1rem',
									whiteSpace: 'pre'
								}}
								dangerouslySetInnerHTML={{
									__html: highlightCode(selectedFileContent, getLanguage(selectedFileName))
								}}
							/>
						</>
					) : (
						<p style={{
							alignItems: 'center',
							color: 'rgba(255, 255, 255, 0.4)',
							display: 'flex',
							height: '100%',
							justifyContent: 'center',
							margin: 0
						}}>
							Select a file to view its contents
						</p>
					)}
				</section>
			</section>

			<aside style={{
				backgroundColor: 'rgba(59, 130, 246, 0.1)',
				border: '1px solid rgba(59, 130, 246, 0.2)',
				borderRadius: '8px',
				marginTop: '1.5rem',
				padding: '1.25rem'
			}}>
				<h3 style={{ color: '#fff', fontSize: '1rem', margin: '0 0 0.75rem 0' }}>
					Next Steps
				</h3>
				<ol style={{
					color: 'rgba(255, 255, 255, 0.8)',
					fontSize: '0.875rem',
					lineHeight: '1.8',
					margin: 0,
					paddingLeft: '1.25rem'
				}}>
					<li>Download the ZIP file using the button above</li>
					<li>Extract the archive to your desired location</li>
					<li>Open a terminal and navigate to the project folder</li>
					<li>Run <code style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '4px', color: '#10b981', padding: '0.125rem 0.375rem' }}>bun dev</code> to start the development server</li>
				</ol>
			</aside>
		</article>
	);
};