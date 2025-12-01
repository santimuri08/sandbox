import { BsThreeDots } from 'react-icons/bs';
import { badgeStyle } from '../../../styles/testingStyles';

export const LoadingBadge = () => (
	<span style={badgeStyle('#999999')}>
		<BsThreeDots />
	</span>
);
