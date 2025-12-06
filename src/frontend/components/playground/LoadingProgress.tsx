import type { MouseEvent } from 'react';
import type { ThemeProps } from '../../../types/springTypes';

const LOADING_STEPS = [
	'Running bun create absolutejs',
	'Installing dependencies',
	'Generating project files',
];

interface LoadingProgressProps extends ThemeProps {
	currentStep: number;
	onCancel: () => void;
}

const spinnerStyles = `
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	@keyframes progress {
		0% { left: -30%; }
		100% { left: 100%; }
	}
`;

const getStepBackgroundColor = (stepIndex: number, currentStep: number) => {
	if (stepIndex < currentStep) return '#10b981';
	if (stepIndex === currentStep) return '#3b82f6';

	return 'rgba(255, 255, 255, 0.1)';
};

const getStepContent = (stepIndex: number, currentStep: number) => {
	if (stepIndex < currentStep) return '✓';

	return String(stepIndex + 1);
};

interface StepIndicatorProps {
	step: string;
	stepIndex: number;
	currentStep: number;
}

const StepIndicator = ({ step, stepIndex, currentStep }: StepIndicatorProps) => {
	const bgColor = getStepBackgroundColor(stepIndex, currentStep);
	const content = getStepContent(stepIndex, currentStep);

	return (
		<span
			key={step}
			style={{
				alignItems: 'center',
				backgroundColor: bgColor,
				borderRadius: '50%',
				color: '#fff',
				display: 'flex',
				fontSize: '0.75rem',
				fontWeight: 600,
				height: '24px',
				justifyContent: 'center',
				width: '24px'
			}}
		>
			{content}
		</span>
	);
};

const LoadingSpinner = () => (
	<figure style={{ height: '80px', margin: '0 auto 2rem', position: 'relative', width: '80px' }}>
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
	</figure>
);

const TimeWarning = () => (
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
			Installing dependencies
		</p>
	</aside>
);

const ProgressBar = () => (
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
	</figure>
);

interface CancelButtonProps {
	onCancel: () => void;
}

const CancelButton = ({ onCancel }: CancelButtonProps) => {
	const handleMouseEnter = (evt: MouseEvent<HTMLButtonElement>) => {
		evt.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
		evt.currentTarget.style.color = '#ef4444';
	};

	const handleMouseLeave = (evt: MouseEvent<HTMLButtonElement>) => {
		evt.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
		evt.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
	};

	return (
		<button
			onClick={onCancel}
			type="button"
			style={{
				backgroundColor: 'transparent',
				border: '1px solid rgba(255, 255, 255, 0.2)',
				borderRadius: '8px',
				color: 'rgba(255, 255, 255, 0.6)',
				cursor: 'pointer',
				fontSize: '0.875rem',
				padding: '0.625rem 1.5rem'
			}}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			Cancel
		</button>
	);
};

export const LoadingProgress = ({ currentStep, onCancel }: LoadingProgressProps) => {
	const currentLabel = LOADING_STEPS[currentStep] || 'Processing...';
	const stepsToShow = LOADING_STEPS.slice(0, -1);

	return (
		<article style={{
			backgroundColor: 'rgba(30, 30, 30, 0.8)',
			border: '1px solid rgba(255, 255, 255, 0.1)',
			borderRadius: '12px',
			marginTop: '2rem',
			padding: '3rem 2rem',
			textAlign: 'center'
		}}>
			<style>{spinnerStyles}</style>

			<LoadingSpinner />

			<h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
				Running bun create absolutejs
			</h2>

			<p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1rem', marginBottom: '2rem' }}>
				{currentLabel}
			</p>

			<nav style={{
				display: 'flex',
				flexWrap: 'wrap',
				gap: '1rem',
				justifyContent: 'center',
				marginBottom: '2rem'
			}}>
				{stepsToShow.map((step, idx) => (
					<StepIndicator key={step} step={step} stepIndex={idx} currentStep={currentStep} />
				))}
			</nav>

			<TimeWarning />
			<ProgressBar />
			<CancelButton onCancel={onCancel} />
		</article>
	);
};

export { LOADING_STEPS };