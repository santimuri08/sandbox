/**
 * LoadingProgress.tsx
 *
 * WHAT IT DOES:
 * - Shows loading progress with multiple steps
 * - Animated spinner
 * - Cancel button for long operations
 * - Informs user that install can take a few minutes
 *
 * WHERE IT GOES:
 * src/frontend/components/playground/LoadingProgress.tsx (replace existing)
 */

import { animated } from '@react-spring/web';
import type { ThemeProps } from '../../../types/springTypes';

interface LoadingProgressProps extends ThemeProps {
	currentStep: number;
	steps: string[];
	onCancel: () => void;
}

export const LoadingProgress = ({
	themeSprings,
	currentStep,
	steps,
	onCancel
}: LoadingProgressProps) => {
	return (
		<div style={{
			backgroundColor: 'rgba(30, 30, 30, 0.8)',
			borderRadius: '12px',
			padding: '3rem 2rem',
			marginTop: '2rem',
			border: '1px solid rgba(255, 255, 255, 0.1)',
			textAlign: 'center'
		}}>
			{/* Spinner */}
			<div style={{
				width: '80px',
				height: '80px',
				margin: '0 auto 2rem',
				position: 'relative'
			}}>
				<div style={{
					position: 'absolute',
					inset: 0,
					border: '4px solid rgba(255, 255, 255, 0.1)',
					borderRadius: '50%'
				}} />
				<div style={{
					position: 'absolute',
					inset: 0,
					border: '4px solid transparent',
					borderTopColor: '#3b82f6',
					borderRadius: '50%',
					animation: 'spin 1s linear infinite'
				}} />
				<style>{`
					@keyframes spin {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}
				`}</style>
			</div>

			{/* Title */}
			<h2 style={{
				color: '#fff',
				fontSize: '1.5rem',
				marginBottom: '0.5rem'
			}}>
				Running bun create absolutejs...
			</h2>

			{/* Current step */}
			<p style={{
				color: 'rgba(255, 255, 255, 0.6)',
				fontSize: '1rem',
				marginBottom: '2rem'
			}}>
				{steps[currentStep] || 'Processing...'}
			</p>

			{/* Step indicators */}
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				gap: '1rem',
				marginBottom: '2rem',
				flexWrap: 'wrap'
			}}>
				{steps.slice(0, -1).map((step, index) => {
					const isComplete = index < currentStep;
					const isCurrent = index === currentStep;

					return (
						<div
							key={index}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '0.5rem'
							}}
						>
							<div style={{
								width: '24px',
								height: '24px',
								borderRadius: '50%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								backgroundColor: isComplete
									? '#10b981'
									: isCurrent
										? '#3b82f6'
										: 'rgba(255, 255, 255, 0.1)',
								color: '#fff',
								fontSize: '0.75rem',
								fontWeight: 600,
								transition: 'all 0.3s ease'
							}}>
								{isComplete ? '✓' : index + 1}
							</div>
						</div>
					);
				})}
			</div>

			{/* Warning message */}
			<div style={{
				backgroundColor: 'rgba(234, 179, 8, 0.1)',
				border: '1px solid rgba(234, 179, 8, 0.3)',
				borderRadius: '8px',
				padding: '1rem',
				marginBottom: '2rem',
				maxWidth: '500px',
				margin: '0 auto 2rem'
			}}>
				<p style={{
					color: '#fbbf24',
					fontSize: '0.875rem',
					margin: 0,
					display: 'flex',
					alignItems: 'center',
					gap: '0.5rem',
					justifyContent: 'center'
				}}>
					<span>⏱️</span>
					Installing dependencies may take 2-5 minutes depending on your connection.
				</p>
			</div>

			{/* Progress bar (indeterminate) */}
			<div style={{
				width: '100%',
				maxWidth: '400px',
				height: '4px',
				backgroundColor: 'rgba(255, 255, 255, 0.1)',
				borderRadius: '2px',
				margin: '0 auto 2rem',
				overflow: 'hidden',
				position: 'relative'
			}}>
				<div style={{
					position: 'absolute',
					height: '100%',
					width: '30%',
					backgroundColor: '#3b82f6',
					borderRadius: '2px',
					animation: 'progress 1.5s ease-in-out infinite'
				}} />
				<style>{`
					@keyframes progress {
						0% { left: -30%; }
						100% { left: 100%; }
					}
				`}</style>
			</div>

			{/* Cancel button */}
			<button
				onClick={onCancel}
				style={{
					padding: '0.625rem 1.5rem',
					borderRadius: '8px',
					border: '1px solid rgba(255, 255, 255, 0.2)',
					backgroundColor: 'transparent',
					color: 'rgba(255, 255, 255, 0.6)',
					cursor: 'pointer',
					fontSize: '0.875rem',
					transition: 'all 0.2s ease'
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
					e.currentTarget.style.color = '#ef4444';
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
					e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
				}}
			>
				Cancel
			</button>
		</div>
	);
};