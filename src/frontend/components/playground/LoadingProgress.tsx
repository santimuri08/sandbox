import type { MouseEvent } from 'react';
import type { ThemeProps } from '../../../types/springTypes';

const LOADING_STEPS = [
	'Validating configuration',
	'Running bun create absolutejs',
	'Installing dependencies',
	'Generating project files',
];

interface LoadingProgressProps extends ThemeProps {
	currentStep: number;
	onCancel: () => void;
}

interface StepIndicatorProps {
	stepIndex: number;
	currentStep: number;
	stepLabel: string;
}

const spinnerKeyframes = `
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
`;

const progressKeyframes = `
	@keyframes progress {
		0% { left: -30%; }
		100% { left: 100%; }
	}
`;

const getStepBackgroundColor = (isComplete: boolean, isCurrent: boolean) => {
	if (isComplete) {
		return '#10b981';
	}

	if (isCurrent) {
		return '#3b82f6';
	}

	return 'rgba(255, 255, 255, 0.1)';
};

const handleCancelMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
	event.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
	event.currentTarget.style.color = '#ef4444';
};

const handleCancelMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
	event.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
	event.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
};

const StepIndicator = ({ stepIndex, currentStep, stepLabel }: StepIndicatorProps) => {
	const isComplete = stepIndex < currentStep;
	const isCurrent = stepIndex === currentStep;
	const displayNumber = stepIndex + 1;
	const backgroundColor = getStepBackgroundColor(isComplete, isCurrent);

	return (
		<li
			key={stepLabel}
			style={{
				alignItems: 'center',
				display: 'flex',
				gap: '0.5rem',
				listStyle: 'none'
			}}
		>
			<span style={{
				alignItems: 'center',
				backgroundColor,
				borderRadius: '50%',
				color: '#fff',
				display: 'flex',
				fontSize: '0.75rem',
				fontWeight: 600,
				height: '24px',
				justifyContent: 'center',
				transition: 'all 0.3s ease',
				width: '24px'
			}}>
				{isComplete ? '✓' : displayNumber}
			</span>
		</li>
	);
};

export const LoadingProgress = ({
	currentStep,
	onCancel
}: LoadingProgressProps) => {
	const currentStepLabel = LOADING_STEPS[currentStep] || 'Processing...';
	const stepsToDisplay = LOADING_STEPS.slice(0, -1);

	return (
		<article style={{
			backgroundColor: 'rgba(30, 30, 30, 0.8)',
			border: '1px solid rgba(255, 255, 255, 0.1)',
			borderRadius: '12px',
			marginTop: '2rem',
			padding: '3rem 2rem',
			textAlign: 'center'
		}}>

			<figure style={{
				height: '80px',
				margin: '0 auto 2rem',
				position: 'relative',
				width: '80px'
			}}>
				<span style={{
					border: '4px solid rgba(255, 255, 255, 0.1)',
					borderRadius: '50%',
					inset: 0,
					position: 'absolute'
				}} />
				<span style={{
					animation: 'spin 1s linear infinite',
					border: '4px solid transparent',
					borderRadius: '50%',
					borderTopColor: '#3b82f6',
					inset: 0,
					position: 'absolute'
				}} />
				<style>{spinnerKeyframes}</style>
			</figure>

			<h2 style={{
				color: '#fff',
				fontSize: '1.5rem',
				marginBottom: '0.5rem'
			}}>
				Running bun create absolutejs
			</h2>

			<p style={{
				color: 'rgba(255, 255, 255, 0.6)',
				fontSize: '1rem',
				marginBottom: '2rem'
			}}>
				{currentStepLabel}
			</p>

			<nav style={{
				display: 'flex',
				flexWrap: 'wrap',
				gap: '1rem',
				justifyContent: 'center',
				marginBottom: '2rem'
			}}>
				<ul style={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '1rem',
					justifyContent: 'center',
					listStyle: 'none',
					margin: 0,
					padding: 0
				}}>
					{stepsToDisplay.map((step, index) => (
						<StepIndicator
							key={step}
							stepIndex={index}
							currentStep={currentStep}
							stepLabel={step}
						/>
					))}
				</ul>
			</nav>

			<aside style={{
				backgroundColor: 'rgba(234, 179, 8, 0.1)',
				border: '1px solid rgba(234, 179, 8, 0.3)',
				borderRadius: '8px',
				margin: '0 auto 2rem',
				maxWidth: '500px',
				padding: '1rem'
			}}>
				<p style={{
					alignItems: 'center',
					color: '#fbbf24',
					display: 'flex',
					fontSize: '0.875rem',
					gap: '0.5rem',
					justifyContent: 'center',
					margin: 0
				}}>
					<span>⏱️</span>
					Installing dependencies may take 2-5 minutes depending on your connection.
				</p>
			</aside>

			<figure style={{
				backgroundColor: 'rgba(255, 255, 255, 0.1)',
				borderRadius: '2px',
				height: '4px',
				margin: '0 auto 2rem',
				maxWidth: '400px',
				overflow: 'hidden',
				position: 'relative',
				width: '100%'
			}}>
				<span style={{
					animation: 'progress 1.5s ease-in-out infinite',
					backgroundColor: '#3b82f6',
					borderRadius: '2px',
					height: '100%',
					position: 'absolute',
					width: '30%'
				}} />
				<style>{progressKeyframes}</style>
			</figure>

			<button
				onClick={onCancel}
				onMouseEnter={handleCancelMouseEnter}
				onMouseLeave={handleCancelMouseLeave}
				type="button"
				style={{
					backgroundColor: 'transparent',
					border: '1px solid rgba(255, 255, 255, 0.2)',
					borderRadius: '8px',
					color: 'rgba(255, 255, 255, 0.6)',
					cursor: 'pointer',
					fontSize: '0.875rem',
					padding: '0.625rem 1.5rem',
					transition: 'all 0.2s ease'
				}}
			>
				Cancel
			</button>
		</article>
	);
};

export { LOADING_STEPS };