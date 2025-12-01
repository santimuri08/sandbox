import { animated } from '@react-spring/web';
import { ThemeProps } from '../../../types/springTypes';
interface LoadingProgressProps extends ThemeProps {
	message?: string;
}
export const LoadingProgress = ({ message = 'Generating your sandbox...', themeSprings }: LoadingProgressProps) => {
	return (
		<animated.div style={{
			marginTop: '1.5rem',
			padding: '2rem',
			backgroundColor: 'rgba(0, 0, 0, 0.3)',
			borderRadius: '12px',
			border: '1px solid rgba(255, 255, 255, 0.1)',
			textAlign: 'center'
		}}>
			<div style={{
				width: '60px',
				height: '60px',
				margin: '0 auto 1.5rem',
				border: '4px solid rgba(255, 255, 255, 0.1)',
				borderTop: '4px solid #3b82f6',
				borderRadius: '50%',
				animation: 'spin 1s linear infinite'
			}} />
			<h4 style={{
				fontSize: '1.1rem',
				fontWeight: 600,
				margin: 0,
				marginBottom: '0.5rem'
			}}>
				{message}
			</h4>
			<p style={{
				fontSize: '0.9rem',
				opacity: 0.8,
				margin: 0,
				marginBottom: '1.5rem'
			}}>
				This may take a few seconds...
			</p>
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				gap: '2rem',
				flexWrap: 'wrap'
			}}>
				<div style={{ textAlign: 'center' }}>
					<div style={{
						fontSize: '1.5rem',
						marginBottom: '0.5rem'
					}}>
                    </div>
					<div style={{
						fontSize: '0.85rem',
						opacity: 0.8
					}}>Validating config</div>
				</div>
				
				<div style={{ textAlign: 'center' }}>
					<div style={{
						fontSize: '1.5rem',
						marginBottom: '0.5rem'
					}}>
                    </div>
					<div style={{
						fontSize: '0.85rem',
						opacity: 0.8
					}}>Generating files</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<div style={{
						fontSize: '1.5rem',
						marginBottom: '0.5rem',
						animation: 'pulse 1.5s ease-in-out infinite'
					}}>⏳</div>
					<div style={{
						fontSize: '0.85rem',
						opacity: 0.8
					}}>Creating sandbox</div>
				</div>
			</div>
			<style>{`
				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
				@keyframes pulse {
					0%, 100% { opacity: 1; transform: scale(1); }
					50% { opacity: 0.5; transform: scale(1.1); }
				}
			`}</style>
		</animated.div>
	);
};