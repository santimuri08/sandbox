import { useState, useMemo, useEffect } from 'react';
import type { ThemeProps } from '../../../types/springTypes';
import { CopyButton } from '../utils/CopyButton';
import { PrismPlus } from '../utils/PrismPlus';

const DEPTH_INDENT = 1.25;
const BASE_PADDING = 0.5;

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

const insertNodeAtPath = (
	current: FileTreeNode[],
	parts: string[],
	partIndex: number,
	fileContent: string
) => {
	const part = parts[partIndex];
	if (!part) return;
	
	const isLast = partIndex === parts.length - 1;
	let existing = current.find((item) => item.name === part);

	if (!existing) {
		existing = {
			children: [], content: isLast ? fileContent : '', isDirectory: !isLast, name: part, path: parts.slice(0, partIndex + 1).join('/')
		};
		current.push(existing);
	}

	if (!isLast) {
		insertNodeAtPath(existing.children, parts, partIndex + 1, fileContent);
	}
};

const sortTreeNodes = (nodes: FileTreeNode[]) => {
	nodes.sort((nodeA, nodeB) => {
		if (nodeA.isDirectory !== nodeB.isDirectory) {
			return nodeA.isDirectory ? -1 : 1;
		}

		return nodeA.name.localeCompare(nodeB.name);
	});
	for (const item of nodes) {
		if (item.isDirectory) sortTreeNodes(item.children);
	}
};

const buildFileTree = (files: GeneratedFile[]) => {
	const root: FileTreeNode[] = [];

	for (const file of files) {
		const parts = file.path.split('/');
		insertNodeAtPath(root, parts, 0, file.content);
	}

	sortTreeNodes(root);

	return root;
};

const getLanguage = (path: string) => {
	const ext = path.split('.').pop() || '';
	const langs: Record<string, string> = {
		css: 'css', html: 'html', js: 'javascript', json: 'json', jsx: 'javascript', md: 'markdown', ts: 'typescript', tsx: 'typescript'
	};

	return langs[ext] || 'plaintext';
};

const escapeHtml = (str: string) =>
	str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const highlightJson = (escaped: string) =>
	escaped
		.replace(/"([^"]+)":/g, '<span style="color:#9cdcfe">"$1"</span>:')
		.replace(/: "([^"]+)"/g, ': <span style="color:#ce9178">"$1"</span>')
		.replace(/: (\d+)/g, ': <span style="color:#b5cea8">$1</span>')
		.replace(/: (true|false|null)/g, ': <span style="color:#569cd6">$1</span>');

const highlightJavaScript = (escaped: string) => {
	let result = escaped
		.replace(/'([^']+)'/g, '<span style="color:#ce9178">\'$1\'</span>')
		.replace(/"([^"]+)"/g, '<span style="color:#ce9178">"$1"</span>');

	const kws = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'async', 'await', 'new', 'class', 'interface', 'type', 'extends', 'implements'];
	for (const keyword of kws) {
		result = result.replace(new RegExp(`\\b(${keyword})\\b`, 'g'), '<span style="color:#569cd6">$1</span>');
	}

	return result.replace(/(\/\/.*)/g, '<span style="color:#6a9955">$1</span>');
};

const highlightCode = (content: string, lang: string) => {
	const escaped = escapeHtml(content || '');
	if (lang === 'json') return highlightJson(escaped);
	if (lang === 'typescript' || lang === 'javascript') return highlightJavaScript(escaped);

	return escaped;
};

// eslint-disable-next-line absolute/no-explicit-return-type
const findFirstFile = (nodes: FileTreeNode[]): FileTreeNode | null => {
	for (const item of nodes) {
		if (!item.isDirectory) return item;
		const found: FileTreeNode | null = findFirstFile(item.children);
		if (found) return found;
	}

	return null;
};

const getTreeIcon = (isDirectory: boolean, isExpanded: boolean) => {
	if (!isDirectory) return '📄';

	return isExpanded ? '📂' : '📁';
};

const FileTreeItem = ({
	node, depth, selectedPath, expandedPaths, onSelect, onToggle
}: FileTreeItemProps) => {
	const isExpanded = expandedPaths.has(node.path);
	const isSelected = selectedPath === node.path;
	const icon = getTreeIcon(node.isDirectory, isExpanded);
	const paddingLeft = `${depth * DEPTH_INDENT + BASE_PADDING}rem`;

	const handleClick = () => {
		if (node.isDirectory) {
			onToggle(node.path);
		} else {
			onSelect(node);
		}
	};

	return (
		<li style={{ listStyle: 'none' }}>
			<button
				onClick={handleClick}
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
					width: '100%'
				}}
			>
				<span style={{ fontSize: '0.75rem', marginRight: '0.5rem' }}>{icon}</span>
				<span style={{ color: node.isDirectory ? '#fff' : 'rgba(255,255,255,0.8)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
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

interface EditingButtonsProps {
	onSave: () => void;
	onCancel: () => void;
}

const EditingButtons = ({ onSave, onCancel }: EditingButtonsProps) => (
	<>
		<button onClick={onSave} type="button" style={{ backgroundColor: '#10b981', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, padding: '0.375rem 0.75rem' }}>Save</button>
		<button onClick={onCancel} type="button" style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, padding: '0.375rem 0.75rem' }}>Cancel</button>
	</>
);

interface ViewingButtonsProps {
	onEdit: () => void;
	fileContent: string;
}

const ViewingButtons = ({ onEdit, fileContent }: ViewingButtonsProps) => (
	<>
		<button onClick={onEdit} type="button" style={{ backgroundColor: '#3b82f6', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, padding: '0.375rem 0.75rem' }}>Edit</button>
		<CopyButton text={fileContent} />
	</>
);

interface FileContentHeaderProps {
	fileName: string;
	isEditing: boolean;
	fileContent: string;
	onStartEdit: () => void;
	onSaveEdit: () => void;
	onCancelEdit: () => void;
}

const FileContentHeader = ({ fileName, isEditing, fileContent, onStartEdit, onSaveEdit, onCancelEdit }: FileContentHeaderProps) => (
	<header style={{
		alignItems: 'center',
		backgroundColor: 'rgba(30, 30, 30, 0.9)',
		borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
		display: 'flex',
		gap: '0.5rem',
		justifyContent: 'space-between',
		padding: '0.5rem 1rem'
	}}>
		<span style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
			{fileName}
			{isEditing && <span style={{ color: '#f59e0b', marginLeft: '0.5rem' }}>(editing)</span>}
		</span>
		<nav style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
			{isEditing ? (
				<EditingButtons onSave={onSaveEdit} onCancel={onCancelEdit} />
			) : (
				<ViewingButtons onEdit={onStartEdit} fileContent={fileContent} />
			)}
		</nav>
	</header>
);

interface FileEditAreaProps {
	editedContent: string;
	onContentChange: (value: string) => void;
}

const FileEditArea = ({ editedContent, onContentChange }: FileEditAreaProps) => (
	<textarea
		value={editedContent}
		onChange={(evt) => onContentChange(evt.target.value)}
		spellCheck={false}
		style={{
			backgroundColor: 'rgba(0, 0, 0, 0.3)',
			border: 'none',
			color: 'rgba(255, 255, 255, 0.9)',
			flex: 1,
			fontFamily: 'monospace',
			fontSize: '0.8rem',
			lineHeight: 1.5,
			margin: 0,
			outline: 'none',
			padding: '1rem',
			resize: 'none',
			width: '100%'
		}}
	/>
);

interface FilePreviewProps {
	fileContent: string;
	filePath: string;
}

const FilePreview = ({ fileContent, filePath }: FilePreviewProps) => (
	<pre
		style={{
			color: 'rgba(255, 255, 255, 0.9)',
			fontFamily: 'monospace',
			fontSize: '0.8rem',
			lineHeight: 1.5,
			margin: 0,
			overflowY: 'auto',
			padding: '1rem',
			whiteSpace: 'pre-wrap',
			wordBreak: 'break-all'
		}}
		dangerouslySetInnerHTML={{ __html: highlightCode(fileContent, getLanguage(filePath)) }}
	/>
);

interface FileContentBodyProps {
	isEditing: boolean;
	editedContent: string;
	fileContent: string;
	filePath: string;
	onContentChange: (value: string) => void;
}

const FileContentBody = ({ isEditing, editedContent, fileContent, filePath, onContentChange }: FileContentBodyProps) => {
	if (isEditing) {
		return <FileEditArea editedContent={editedContent} onContentChange={onContentChange} />;
	}

	return <FilePreview fileContent={fileContent} filePath={filePath} />;
};

const EmptyFileContent = () => (
	<section style={{
		alignItems: 'center',
		color: 'rgba(255, 255, 255, 0.4)',
		display: 'flex',
		height: '100%',
		justifyContent: 'center'
	}}>
		Select a file to view
	</section>
);

interface CliSectionProps extends ThemeProps {
	cliCommand: string;
	cliOutput: string;
}

const CliSection = ({ cliCommand, cliOutput, themeSprings }: CliSectionProps) => {
	const [showOutput, setShowOutput] = useState(false);

	const handleToggle = () => {
		setShowOutput((prev) => !prev);
	};

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
				<span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
					CLI Command
				</span>
				<button
					onClick={handleToggle}
					type="button"
					style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.75rem' }}
				>
					{showOutput ? 'Hide ▲' : 'Show ▼'}
				</button>
			</header>
			<PrismPlus codeString={cliCommand} language="bash" showLineNumbers={false} themeSprings={themeSprings} />
			{showOutput && (
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
					{cliOutput || 'No output'}
				</pre>
			)}
		</section>
	);
};

interface FileViewerHeaderProps {
	files: GeneratedFile[];
	projectName: string;
	onStartOver: () => void;
}

const FileViewerHeader = ({ files, projectName, onStartOver }: FileViewerHeaderProps) => {
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

interface FileSidebarProps {
	projectName: string;
	fileTree: FileTreeNode[];
	selectedPath: string;
	expandedPaths: Set<string>;
	onSelect: (node: FileTreeNode) => void;
	onToggle: (path: string) => void;
}

const FileSidebar = ({ projectName, fileTree, selectedPath, expandedPaths, onSelect, onToggle }: FileSidebarProps) => (
	<aside style={{ backgroundColor: 'rgba(30, 30, 30, 0.9)', maxHeight: '600px', overflowY: 'auto' }}>
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
			{fileTree.map((treeNode) => (
				<FileTreeItem
					key={treeNode.path}
					node={treeNode}
					depth={0}
					selectedPath={selectedPath}
					expandedPaths={expandedPaths}
					onSelect={onSelect}
					onToggle={onToggle}
				/>
			))}
		</ul>
	</aside>
);

interface FileContentPanelProps {
	selectedFile: FileTreeNode | null;
	isEditing: boolean;
	editedContent: string;
	onStartEdit: () => void;
	onSaveEdit: () => void;
	onCancelEdit: () => void;
	onContentChange: (value: string) => void;
}

const FileContentPanel = ({
	selectedFile,
	isEditing,
	editedContent,
	onStartEdit,
	onSaveEdit,
	onCancelEdit,
	onContentChange
}: FileContentPanelProps) => (
	<section style={{
		backgroundColor: 'rgba(20, 20, 20, 0.95)',
		display: 'flex',
		flexDirection: 'column',
		maxHeight: '600px'
	}}>
		{selectedFile ? (
			<>
				<FileContentHeader
					fileName={selectedFile.name}
					isEditing={isEditing}
					fileContent={selectedFile.content}
					onStartEdit={onStartEdit}
					onSaveEdit={onSaveEdit}
					onCancelEdit={onCancelEdit}
				/>
				<FileContentBody
					isEditing={isEditing}
					editedContent={editedContent}
					fileContent={selectedFile.content}
					filePath={selectedFile.path}
					onContentChange={onContentChange}
				/>
			</>
		) : (
			<EmptyFileContent />
		)}
	</section>
);

export const FileViewer = ({
	files, projectName, cliCommand, cliOutput, onStartOver, themeSprings, onFilesChange
}: FileViewerProps) => {
	const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(null);
	const [expandedPaths, setExpandedPaths] = useState(new Set(['src']));
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState('');

	const fileTree = useMemo(() => buildFileTree(files), [files]);

	useEffect(() => {
		if (selectedFile || !files.length) return;
		
		const first = findFirstFile(fileTree);
		if (first) setSelectedFile(first);
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

	const handleSelect = (fileNode: FileTreeNode) => {
		if (isEditing) {
			setIsEditing(false);
			setEditedContent('');
		}
		setSelectedFile(fileNode);
	};

	const handleStartEdit = () => {
		if (!selectedFile) return;
		setEditedContent(selectedFile.content);
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditedContent('');
	};

	const handleSaveEdit = () => {
		if (!selectedFile || !onFilesChange) {
			setIsEditing(false);

			return;
		}

		const updated = files.map((file) =>
			file.path === selectedFile.path ? { ...file, content: editedContent } : file
		);

		setSelectedFile({ ...selectedFile, content: editedContent });
		onFilesChange(updated);
		setIsEditing(false);
		setEditedContent('');
	};

	const selectedPath = selectedFile?.path || '';

	return (
		<article style={{ marginTop: '2rem' }}>
			<FileViewerHeader
				files={files}
				projectName={projectName}
				onStartOver={onStartOver}
			/>
			<CliSection
				cliCommand={cliCommand}
				cliOutput={cliOutput}
				themeSprings={themeSprings}
			/>
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
				<FileSidebar
					projectName={projectName}
					fileTree={fileTree}
					selectedPath={selectedPath}
					expandedPaths={expandedPaths}
					onSelect={handleSelect}
					onToggle={handleToggle}
				/>
				<FileContentPanel
					selectedFile={selectedFile}
					isEditing={isEditing}
					editedContent={editedContent}
					onStartEdit={handleStartEdit}
					onSaveEdit={handleSaveEdit}
					onCancelEdit={handleCancelEdit}
					onContentChange={setEditedContent}
				/>
			</section>
		</article>
	);
};