import { animated } from '@react-spring/web';
import { FaTimes } from 'react-icons/fa';
import { ThemeSprings } from '../../../types/springTypes';

type HamburgerHeaderProps = {
	onClose: () => void;
	themeSprings: ThemeSprings;
};

export const HamburgerHeader = ({
	onClose,
	themeSprings
}: HamburgerHeaderProps) => (
	<animated.div
		style={{
			alignItems: 'center',
			backgroundColor: themeSprings.themePrimary,
			boxShadow: `0px 4px 14px rgba(0, 0, 0, 0.1)`,
			display: 'flex',
			justifyContent: 'space-between',
			left: 0,
			maxHeight: '100px',
			padding: '1.1rem',
			position: 'absolute',
			top: 0,
			width: '100%'
		}}
	>
		<a
			href="/"
			style={{
				color: 'inherit',
				fontSize: '1.5rem',
				fontWeight: 'bold',
				textDecoration: 'none'
			}}
		>
			AbsoluteJS
		</a>
		<FaTimes
			style={{
				cursor: 'pointer',
				fontSize: '34px'
			}}
			onClick={onClose}
		/>
	</animated.div>
);
