import { animated } from '@react-spring/web';
import { ProviderOption } from 'citra';
import { Dispatch, SetStateAction } from 'react';
import { FiUser } from 'react-icons/fi';
import { ThemeSprings } from '../../../types/springTypes';
import { providerData, ProviderInfo } from '../../data/providerData';
import {
	oauthButtonStyle,
	oauthButtonContentStyle,
	oauthIconStyle,
	oauthButtonTextStyle
} from '../../styles/authModalStyles';

type OAuthButtonProps = {
	provider: Lowercase<ProviderOption>;
	setModalContent: Dispatch<
		SetStateAction<
			(ProviderInfo & { providerOption: ProviderOption }) | null
		>
	>;
	themeSprings: ThemeSprings;
};

export const OAuthButton = ({
	provider,
	setModalContent,
	themeSprings
}: OAuthButtonProps) => {
	const {
		logoUrl,
		name,
		primaryColor,
		manageCredentialsUrl,
		createNewCredentialsUrl
	} = providerData[provider];

	return (
		<animated.button
			style={oauthButtonStyle({
				isProviderSelected: true,
				providerPrimaryColor: primaryColor,
				themeSprings: themeSprings
			})}
			onClick={() => {
				const params = new URLSearchParams(window.location.search);
				params.set('provider', provider);

				const newUrl = `${window.location.pathname}?${params.toString()}`;
				window.history.replaceState(null, '', newUrl);

				setModalContent({
					createNewCredentialsUrl,
					logoUrl,
					manageCredentialsUrl,
					name,
					primaryColor,
					providerOption: provider
				});
			}}
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
				<span style={oauthButtonTextStyle}>{name}</span>
			</div>
		</animated.button>
	);
};
