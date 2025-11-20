import { animated } from '@react-spring/web';
import { ThemeProps } from '../../../types/springTypes';
import { featureCard } from '../../styles/homeStyles';
import { buttonStyle, headingStyle, paragraphStyle } from '../../styles/styles';

export const AuthArticle = ({ themeSprings }: ThemeProps) => (
	<animated.article style={featureCard(themeSprings)}>
		<animated.h2 style={headingStyle(themeSprings)}>
			Comprehensive OAuth2 Support
		</animated.h2>
		<animated.p style={paragraphStyle(themeSprings)}>
			Absolute Auth includes 66 preconfigured OAuth2 providers and handles
			the backend logic for any provider, RFC compliant or not. PKCE and
			OpenID flows are automatically implemented for all compliant
			providers, and we also provide a built-in profile route to fetch
			user data using the access token. You define scopes, search
			parameters and custom handlers such as onCallbackSuccess or
			onCallbackError for total flexibility. Session management stores
			accessToken, refreshToken and your user type in cookies with an
			expiration timestamp so you can retrieve the current user by session
			id. AbsoluteJS takes the hard part out of authentication so you can
			focus on your application logic without extra fees or vendor
			lock-in.
		</animated.p>
		<animated.a
			href="/testing/authentication"
			style={buttonStyle({
				backgroundColor: themeSprings.themePrimary,
				color: themeSprings.contrastPrimary
			})}
		>
			Test the OAuth2 Providers
		</animated.a>
	</animated.article>
);
