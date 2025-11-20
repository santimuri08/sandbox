import { ThemeSprings } from '../../../types/springTypes';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { JsonLine } from './JsonLine';

type HighlightedJsonProps = {
	data: unknown;
	primaryColor: string;
	themeSprings: ThemeSprings;
};

export const HighlightedJson = ({
	data,
	primaryColor,
	themeSprings
}: HighlightedJsonProps) => {
	const jsonString = JSON.stringify(data ?? {}, null, 2);
	const jsonLines = jsonString
		.split('\n')
		.slice(1, -1)
		.map((line) => line.replace(/^ {2}/, ''));

	const { isSizeOrLess } = useMediaQuery();
	const isMobile = isSizeOrLess('sm');

	return (
		<pre
			style={{
				border: `2px solid ${primaryColor}`,
				borderRadius: '4px',
				fontFamily: 'monospace',
				height: isMobile ? '200px' : '300px',
				margin: '0 0 8px',
				overflow: 'auto',
				padding: '16px',
				whiteSpace: 'pre-wrap'
			}}
		>
			<code>
				{jsonLines.map((line, lineIndex) => (
					<JsonLine
						themeSprings={themeSprings}
						key={lineIndex}
						line={line}
						needsNewline={lineIndex < jsonLines.length - 1}
					/>
				))}
			</code>
		</pre>
	);
};
