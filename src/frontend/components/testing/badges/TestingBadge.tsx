import { AiOutlineExperiment } from 'react-icons/ai';
import { badgeStyle } from '../../../styles/testingStyles';

export const TestingBadge = () => (
	<span style={badgeStyle('#ff9800')}>
		<AiOutlineExperiment />
	</span>
);
