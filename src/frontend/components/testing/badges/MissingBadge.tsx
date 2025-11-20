import { AiOutlineMinusCircle } from 'react-icons/ai';
import { badgeStyle } from '../../../styles/testingStyles';

export const MissingBadge = () => (
	<span style={badgeStyle('#e0e0e0', '#333')}>
		<AiOutlineMinusCircle />
	</span>
);
