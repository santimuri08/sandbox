import type { ThemeProps } from '../../../types/springTypes';

interface ErrorDisplayProps extends ThemeProps {
	errorMessage: string;
	onRetry: () => void;
}

export const ErrorDisplay = ({ errorMessage, onRetry }: ErrorDisplayProps) => {
	const isTimeout = /timeout|timed out|failed to fetch/i.test(errorMessage);

	return (
		<article style={{
			backgroundColor: 'rgba(30, 30, 30, 0.8)',
			border: '1px solid rgba(239, 68, 68, 0.3)',
			borderRadius: '12px',
			marginTop: '2rem',
			padding: '2rem'
		}}>
			<h2 style={{
				color: '#ef4444',
				fontSize: '1.5rem',
				marginBottom: '0.5rem',
				textAlign: 'center'
			}}>
				Generation Failed
			</h2>

			<section style={{
				backgroundColor: 'rgba(0, 0, 0, 0.3)',
				borderRadius: '8px',
				margin: '0 auto 1.5rem',
				maxWidth: '600px',
				padding: '1rem'
			}}>
				<code style={{ color: '#fca5a5', fontSize: '0.875rem', wordBreak: 'break-word' }}>
					{errorMessage}
				</code>
			</section>

			{isTimeout && (
				<aside style={{
					backgroundColor: 'rgba(234, 179, 8, 0.1)',
					border: '1px solid rgba(234, 179, 8, 0.3)',
					borderRadius: '8px',
					margin: '0 auto 1.5rem',
					maxWidth: '600px',
					padding: '1rem'
				}}>
					<h3 style={{ color: '#fbbf24', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
						Timeout
					</h3>
					<p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', margin: 0 }}>
						Installing dependencies. Please wait.
					</p>
				</aside>
			)}

			<section style={{ margin: '0 auto 1.5rem', maxWidth: '600px', textAlign: 'left' }}>
				<h3 style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
					Common causes:
				</h3>
				<ul style={{
					color: 'rgba(255, 255, 255, 0.6)',
					fontSize: '0.875rem',
					lineHeight: '1.8',
					margin: 0,
					paddingLeft: '1.25rem'
				}}>
					<li>Network timeout during package installation</li>
					<li>Invalid project configuration</li>
				</ul>
			</section>

			<nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
				<button
					onClick={onRetry}
					type="button"
					style={{
						alignItems: 'center',
						backgroundColor: '#3b82f6',
						border: 'none',
						borderRadius: '8px',
						color: '#fff',
						cursor: 'pointer',
						display: 'flex',
						fontSize: '1rem',
						fontWeight: 600,
						gap: '0.5rem',
						padding: '0.75rem 2rem'
					}}
				>
					Try Again
				</button>
			</nav>
		</article>
	);
};