import { animated } from '@react-spring/web';
import { ThemeProps } from '../../../types/springTypes';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { CopyButton } from '../utils/CopyButton';

export const CreateButton = ({ themeSprings }: ThemeProps) => {
	const { isSizeOrLess } = useMediaQuery();
	const isMobile = isSizeOrLess('sm');

	return (
		<animated.div
			style={{
				alignItems: 'center',
				backgroundColor: themeSprings.themeTertiary,
				borderRadius: '16px',
				boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
				color: themeSprings.contrastPrimary,
				display: 'flex',
				justifyContent: 'center',
				padding: '10px 20px'
			}}
		>
			<code
				style={{
					fontSize: isMobile ? '1rem' : '1.2rem',
					marginRight: '2rem',
					textWrap: 'nowrap'
				}}
			>
				bun create absolutejs
			</code>
			<CopyButton text="bun create absolutejs" />
		</animated.div>
	);
};
