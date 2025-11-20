import { ImWarning } from 'react-icons/im';
import { badgeStyle } from '../../../styles/testingStyles';

export const FailedBadge = () => (
	<span style={badgeStyle('#e53935')}>
		<ImWarning />
	</span>
);
