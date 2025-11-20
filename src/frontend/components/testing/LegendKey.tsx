import { LegendData } from '../../data/legendData';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { renderBadge } from '../utils/renderBadge';

export const LegendKey = ({ status, message }: LegendData) => {
	const { isSizeOrLess } = useMediaQuery();
	const isMobile = isSizeOrLess('sm');
	const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

	if (!isMobile) {
		return (
			<div
				style={{
					alignItems: 'center',
					display: 'flex',
					justifyContent: 'flex-start',
					margin: '8px auto',
					maxWidth: 600,
					width: '80%'
				}}
			>
				<div
					style={{
						alignItems: 'center',
						display: 'flex',
						justifyContent: 'center',
						width: 32
					}}
				>
					{renderBadge(status)}
				</div>
				<p style={{ lineHeight: 1.4, margin: 0, marginLeft: 8 }}>
					<strong>{capitalizedStatus}:</strong> {message}
				</p>
			</div>
		);
	}

	return (
		<div
			style={{
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
				margin: '8px auto',
				width: '90%'
			}}
		>
			<div
				style={{
					alignItems: 'center',
					display: 'flex',
					justifyContent: 'center'
				}}
			>
				{renderBadge(status)}
				<span style={{ fontWeight: 'bold', marginLeft: 8 }}>
					{capitalizedStatus}
				</span>
			</div>
			<span
				style={{
					lineHeight: 1.4,
					marginTop: 4,
					maxWidth: '100%',
					textAlign: 'center'
				}}
			>
				{message}
			</span>
		</div>
	);
};
