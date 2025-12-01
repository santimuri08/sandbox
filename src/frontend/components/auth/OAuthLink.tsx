import { animated } from '@react-spring/web';
import { ProviderOption } from 'citra';
import { FiUser } from 'react-icons/fi';
import { ThemeSprings } from '../../../types/springTypes';
import { providerData, ProviderInfo } from '../../data/providerData';
import {
	oauthButtonStyle,
	oauthButtonContentStyle,
	oauthIconStyle,
	oauthButtonTextStyle
} from '../../styles/authModalStyles';

type OAuthLinkProps = {
	mode: 'login' | 'signup';
	provider: Lowercase<ProviderOption> | undefined;
	themeSprings: ThemeSprings;
};

export const OAuthLink = ({ mode, provider, themeSprings }: OAuthLinkProps) => {
	const defaultData: ProviderInfo = {
		createNewCredentialsUrl: '/oauth2/credentials/create',
		logoUrl: '/assets/svg/todo-put-file.svg',
		manageCredentialsUrl: '/oauth2/credentials',
		name: 'other provider',
		primaryColor: 'lightgray'
	};

	const { logoUrl, name, primaryColor } =
		provider && providerData[provider]
			? providerData[provider]
			: defaultData;

	const isProviderSelected = provider !== undefined;

	const buttonText =
		mode === 'login' ? `Sign in with ${name}` : `Sign up with ${name}`;

	return (
		<animated.a
			href={provider ? `/oauth2/${provider}/authorization` : undefined}
			style={oauthButtonStyle({
				isProviderSelected,
				providerPrimaryColor: isProviderSelected
					? primaryColor
					: '#999999',
				themeSprings
			})}
		>
			<div style={oauthButtonContentStyle}>
				{provider ? (
					<img
						src={logoUrl}
						alt={`${name} logo`}
						style={oauthIconStyle}
					/>
				) : (
					<FiUser style={oauthIconStyle} />
				)}
				<span style={oauthButtonTextStyle}>{buttonText}</span>
			</div>
		</animated.a>
	);
};
