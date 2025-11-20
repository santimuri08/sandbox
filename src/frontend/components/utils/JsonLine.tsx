import { animated } from '@react-spring/web';
import { ThemeSprings } from '../../../types/springTypes';

type JsonLineProps = {
	line: string;
	needsNewline: boolean;
	themeSprings: ThemeSprings;
};

type ThemeMode = 'light' | 'dark';
type ColorKey =
	| 'boolean'
	| 'key'
	| 'null'
	| 'number'
	| 'punctuation'
	| 'string'
	| 'text';

const colorMap: Record<ThemeMode, Record<ColorKey, string>> = {
	dark: {
		boolean: '#8be9fd',
		key: '#ff79c6',
		null: '#6272a4',
		number: '#bd93f9',
		punctuation: '#f8f8f2',
		string: '#50fa7b',
		text: '#f8f8f2'
	},
	light: {
		boolean: '#0000ff',
		key: '#a31515',
		null: '#808080',
		number: '#098658',
		punctuation: '#000000',
		string: '#008000',
		text: '#000000'
	}
};

const tokenPattern =
	/("(?:\\u[0-9A-Fa-f]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|true|false|null|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[[\]{},])/g;

const colorRules: [RegExp, ColorKey][] = [
	[/^".*":$/, 'key'],
	[/^"/, 'string'],
	[/^(true|false)$/, 'boolean'],
	[/^null$/, 'null'],
	[/^-?\d/, 'number']
];

const defaultColorKey: ColorKey = 'punctuation';

const getTokenColorKey = (token: string) =>
	colorRules.find(([pattern]) => pattern.test(token))?.[1] ?? defaultColorKey;

export const JsonLine = ({
	line,
	needsNewline,
	themeSprings
}: JsonLineProps) => {
	// const colors = theme === 'dark' ? colorMap.dark : colorMap.light;
	const colors = themeSprings.theme.to((mode) =>
		mode === 'dark' ? colorMap.dark : colorMap.light
	);

	const segments = line.split(tokenPattern).filter((segment) => segment);

	return (
		<span>
			{segments.map((segment, idx) => (
				<animated.span
					key={idx}
					style={{
						color: colors.to((c) =>
							tokenPattern.test(segment)
								? c[getTokenColorKey(segment)]
								: c.text
						)
					}}
				>
					{segment}
				</animated.span>
			))}
			{needsNewline && '\n'}
		</span>
	);
};
