import { ThemeProps } from '../../../types/springTypes';
import { heroStyle, navStyle } from '../../styles/homeStyles';
import { CreateButton } from './CreateButton';
import { HomeHeader } from './HomeHeader';

export const CommandSection = ({ themeSprings }: ThemeProps) => (
	<section style={heroStyle}>
		<HomeHeader themeSprings={themeSprings} />
		<CreateButton themeSprings={themeSprings} />
		<nav style={navStyle}>
			<a
				href="/playground"
				style={{
					alignItems: 'center',
					background: '#0070f3',
					border: '1px solid #0070f3',
					borderRadius: '4px',
					color: '#fff',
					display: 'inline-flex',
					justifyContent: 'center',
					padding: '0.75rem 1.5rem',
					textDecoration: 'none'
				}}
			>
				Try in Browser
			</a>
			<a
				href="/docs"
				style={{
					alignItems: 'center',
					background: 'transparent',
					border: '1px solid #0070f3',
					borderRadius: '4px',
					color: '#0070f3',
					display: 'inline-flex',
					justifyContent: 'center',
					padding: '0.75rem 1.5rem',
					textDecoration: 'none'
				}}
			>
				Read Docs
			</a>
		</nav>
	</section>
);
