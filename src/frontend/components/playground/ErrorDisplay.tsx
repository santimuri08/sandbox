/**
 * ErrorDisplay.tsx
 *
 * WHAT IT DOES:
 * - Displays error messages when generation fails
 * - Provides retry button
 * - Shows helpful troubleshooting tips
 *
 * WHERE IT GOES:
 * src/frontend/components/playground/ErrorDisplay.tsx (replace existing)
 */

import { animated } from '@react-spring/web';
import type { ThemeProps } from '../../../types/springTypes';

interface ErrorDisplayProps extends ThemeProps {
	errorMessage: string;
	onRetry: () => void;
}

export const ErrorDisplay = ({
	themeSprings,
	errorMessage,
	onRetry
}: ErrorDisplayProps) => {
	const isTimeout = errorMessage.toLowerCase().includes('timeout') ||
		errorMessage.toLowerCase().includes('timed out') ||
		errorMessage.toLowerCase().includes('failed to fetch');

	return (
		<div style={{
			backgroundColor: 'rgba(30, 30, 30, 0.8)',
			borderRadius: '12px',
			padding: '2rem',
			marginTop: '2rem',
			border: '1px solid rgba(239, 68, 68, 0.3)'
		}}>
			{/* Error icon */}
			<div style={{
				width: '64px',
				height: '64px',
				margin: '0 auto 1.5rem',
				backgroundColor: 'rgba(239, 68, 68, 0.1)',
				borderRadius: '50%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: '2rem'
			}}>
				❌
			</div>

			{/* Title */}
			<h2 style={{
				color: '#ef4444',
				fontSize: '1.5rem',
				marginBottom: '0.5rem',
				textAlign: 'center'
			}}>
				Generation Failed
			</h2>

			{/* Error message */}
			<div style={{
				backgroundColor: 'rgba(0, 0, 0, 0.3)',
				borderRadius: '8px',
				padding: '1rem',
				marginBottom: '1.5rem',
				maxWidth: '600px',
				margin: '0 auto 1.5rem'
			}}>
				<code style={{
					color: '#fca5a5',
					fontSize: '0.875rem',
					wordBreak: 'break-word'
				}}>
					{errorMessage}
				</code>
			</div>

			{/* Troubleshooting tips */}
			{isTimeout && (
				<div style={{
					backgroundColor: 'rgba(234, 179, 8, 0.1)',
					border: '1px solid rgba(234, 179, 8, 0.3)',
					borderRadius: '8px',
					padding: '1rem',
					marginBottom: '1.5rem',
					maxWidth: '600px',
					margin: '0 auto 1.5rem'
				}}>
					<h3 style={{ color: '#fbbf24', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
						💡 This might be a timeout issue
					</h3>
					<p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', margin: 0 }}>
						Installing dependencies can take several minutes. The server might still be working.
						You can try again, or if this keeps happening, try using fewer dependencies.
					</p>
				</div>
			)}

			{/* Common issues */}
			<div style={{
				maxWidth: '600px',
				margin: '0 auto 1.5rem',
				textAlign: 'left'
			}}>
				<h3 style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
					Common causes:
				</h3>
				<ul style={{
					color: 'rgba(255, 255, 255, 0.6)',
					fontSize: '0.875rem',
					paddingLeft: '1.25rem',
					margin: 0,
					lineHeight: '1.8'
				}}>
					<li>Network timeout during package installation</li>
					<li>Invalid project configuration</li>
					<li>Server temporarily unavailable</li>
				</ul>
			</div>

			{/* Actions */}
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				gap: '1rem',
				marginTop: '2rem'
			}}>
				<button
					onClick={onRetry}
					style={{
						padding: '0.75rem 2rem',
						borderRadius: '8px',
						border: 'none',
						backgroundColor: '#3b82f6',
						color: '#fff',
						cursor: 'pointer',
						fontSize: '1rem',
						fontWeight: 600,
						display: 'flex',
						alignItems: 'center',
						gap: '0.5rem'
					}}
				>
					🔄 Try Again
				</button>
			</div>
		</div>
	);
};