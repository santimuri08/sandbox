import { FaCheckCircle } from 'react-icons/fa';
import { badgeStyle } from '../../../styles/testingStyles';

export const TestedBadge = () => (
	<span style={badgeStyle('#4caf50')}>
		<FaCheckCircle />
	</span>
);
