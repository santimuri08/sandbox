import { FaRegQuestionCircle } from 'react-icons/fa';
import { badgeStyle } from '../../../styles/testingStyles';

export const UntestedBadge = () => (
	<span style={badgeStyle('#888')}>
		<FaRegQuestionCircle />
	</span>
);
