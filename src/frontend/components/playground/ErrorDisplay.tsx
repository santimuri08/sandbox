import { animated } from '@react-spring/web';
import { ThemeProps } from '../../../types/springTypes';
interface ErrorDisplayProps extends ThemeProps {
	error: string;
	onRetry: () => void;
	onDismiss: () => void;
}
export const ErrorDisplay = ({ error, onRetry, onDismiss, themeSprings }: ErrorDisplayProps) => {
	return (
		<animated.div style={{
			marginTop: '1rem',
			padding: '1.25rem',
			backgroundColor: 'rgba(220, 38, 38, 0.1)',
			border: '1px solid rgba(220, 38, 38, 0.3)',
			borderRadius: '8px',
			animation: 'slideDown 0.3s ease-out'
		}}>
			<div style={{
				display: 'flex',
				alignItems: 'flex-start',
				gap: '1rem'
			}}>
				<div style={{
					fontSize: '1.5rem',
					flexShrink: 0
				}}>
					⚠️
				</div>
				<div style={{ flex: 1 }}>
					<h5 style={{
						fontSize: '1rem',
						fontWeight: 600,
						margin: 0,
						marginBottom: '0.5rem',
						color: '#fca5a5'
					}}>
						Something went wrong
					</h5>
					<p style={{
						fontSize: '0.9rem',
						color: '#fca5a5',
						margin: 0,
						marginBottom: '1rem',
						lineHeight: 1.5
					}}>
						{error}
					</p>
					<div style={{
						display: 'flex',
						gap: '0.75rem',
						flexWrap: 'wrap'
					}}>
						<button
							onClick={onRetry}
							style={{
								padding: '0.5rem 1rem',
								backgroundColor: '#ef4444',
								color: 'white',
								border: 'none',
								borderRadius: '6px',
								fontSize: '0.9rem',
								fontWeight: 500,
								cursor: 'pointer',
								transition: 'background-color 0.2s'
							}}
							onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
							onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
						>
							Try Again
						</button>
						<button
							onClick={onDismiss}
							style={{
								padding: '0.5rem 1rem',
								backgroundColor: 'transparent',
								color: '#fca5a5',
								border: '1px solid rgba(220, 38, 38, 0.3)',
								borderRadius: '6px',
								fontSize: '0.9rem',
								fontWeight: 500,
								cursor: 'pointer',
								transition: 'all 0.2s'
							}}
							onMouseOver={(e) => {
								e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
								e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.5)';
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.backgroundColor = 'transparent';
								e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
							}}
						>
							Dismiss
						</button>
					</div>
				</div>
				<button
					onClick={onDismiss}
					style={{
						background: 'none',
						border: 'none',
						color: '#fca5a5',
						fontSize: '1.5rem',
						cursor: 'pointer',
						padding: 0,
						lineHeight: 1,
						opacity: 0.6,
						transition: 'opacity 0.2s'
					}}
					onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
					onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
				>
					x
				</button>
			</div>
			<style>{`
				@keyframes slideDown {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</animated.div>
	);
};