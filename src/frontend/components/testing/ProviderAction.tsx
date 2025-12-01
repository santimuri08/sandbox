import { UseQueryResult } from '@tanstack/react-query';
import { Provider } from '../../../../db/schema';
import {
	buttonContainerStyle,
	opButtonStyle
} from '../../styles/authModalStyles';
import { renderBadge } from '../utils/renderBadge';

type ProviderActionProps = {
	keyName:
		| 'authorize_status'
		| 'profile_status'
		| 'refresh_status'
		| 'revoke_status';
	providerStatuses: UseQueryResult<Omit<Provider, 'name'> | null>;
	type: 'button' | 'link';
	href?: string;
	disabled: boolean;
	label: string;
	onClick?: () => void;
	color: string;
};

export const ProviderAction = ({
	keyName,
	providerStatuses,
	type,
	href,
	disabled,
	label,
	color,
	onClick
}: ProviderActionProps) => (
	<div style={buttonContainerStyle}>
		{renderBadge(providerStatuses.data?.[keyName])}
		{type === 'link' ? (
			<a href={href} style={opButtonStyle(disabled, color)}>
				{label}
			</a>
		) : (
			<button
				disabled={disabled}
				onClick={onClick}
				style={opButtonStyle(disabled, color)}
			>
				{label}
			</button>
		)}
	</div>
);
