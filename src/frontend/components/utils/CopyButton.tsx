import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import { LuCopyCheck } from 'react-icons/lu';
import { COPY_TIMEOUT_DURATION } from '../../../constants';

type CopyButtonProps = {
	text: string;
};

export const CopyButton = ({ text }: CopyButtonProps) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), COPY_TIMEOUT_DURATION);

				return true;
			})
			.catch((err) => {
				console.error('Copy failed', err);
			});
	};

	return (
		<button
			onClick={handleCopy}
			style={{
				alignItems: 'center',
				backgroundColor: 'transparent',
				border: 'none',
				color: 'inherit',
				cursor: 'pointer',
				display: 'flex',
				justifyContent: 'center'
			}}
		>
			{copied ? <LuCopyCheck /> : <FiCopy />}
			<p
				style={{
					fontSize: '0.8rem',
					marginLeft: '0.25rem',
					minWidth: '6ch'
				}}
			>
				{copied ? 'Copied' : 'Copy'}
			</p>
		</button>
	);
};
