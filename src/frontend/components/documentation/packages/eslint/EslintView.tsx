import { ThemeProps } from '../../../../../types/springTypes';
import { eslintDocsData } from '../../../../data/documentation/eslintDocsData';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import {
	mainContentStyle,
	h1Style,
	paragraphLargeStyle
} from '../../../../styles/docsStyles';
import { TableOfContents, TocItem } from '../../../utils/TableOfContents';
import { EslintSection } from './EslintSection';

const tocItems: TocItem[] = eslintDocsData.map((section) => ({
	href: section.href,
	label: section.title.replace('absolute/', '')
}));

export const EslintView = ({ themeSprings }: ThemeProps) => {
	const { isSizeOrLess } = useMediaQuery();
	const isMobile = isSizeOrLess('sm');

	return (
		<div
			style={{
				display: 'flex',
				flex: 1,
				overflowX: 'hidden',
				overflowY: 'auto',
				position: 'relative'
			}}
		>
			<div style={mainContentStyle}>
				<h1 style={h1Style}>ESLint</h1>
				<p style={paragraphLargeStyle}>
					ESLint is a static code analysis tool for identifying and
					fixing problems in JavaScript code. It helps maintain code
					quality and consistency by enforcing coding standards and
					best practices.
				</p>

				{eslintDocsData.map((section) => (
					<EslintSection
						key={section.href}
						section={section}
						themeSprings={themeSprings}
					/>
				))}
			</div>

			{!isMobile && (
				<TableOfContents items={tocItems} themeSprings={themeSprings} />
			)}
		</div>
	);
};
