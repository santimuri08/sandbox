import type { SandboxFiles } from './generateSandboxFiles';
export interface StackBlitzProject {
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
export function convertToStackBlitzFiles(files: SandboxFiles): Record<string, string> {
	const stackBlitzFiles: Record<string, string> = {};

	for (const [path, file] of Object.entries(files)) {
		stackBlitzFiles[path] = file.content;
	}

	return stackBlitzFiles;
}
export function createStackBlitzProject(
	files: SandboxFiles,
	title: string = 'AbsoluteJS Project'
): StackBlitzProject {
	return {
		title,
		description: 'Generated with AbsoluteJS Playground',
		template: 'node',
		files: convertToStackBlitzFiles(files),
		settings: {
			compile: {
				trigger: 'auto',
				clearConsole: false
			}
		}
	};
}
export function generateStackBlitzUrl(project: StackBlitzProject): string {
	const projectData = {
		title: project.title,
		description: project.description,
		template: project.template,
		files: project.files
	};
	const encoded = Buffer.from(JSON.stringify(projectData)).toString('base64');
	return `https://stackblitz.com/run?project=${encodeURIComponent(encoded)}`;
}