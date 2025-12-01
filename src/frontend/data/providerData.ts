import { ProviderOption } from 'citra';

export type ProviderInfo = {
	name: string;
	logoUrl: string;
	primaryColor: string;
	manageCredentialsUrl: string;
	createNewCredentialsUrl: string;
};

type ProviderData = Record<Lowercase<ProviderOption>, ProviderInfo>;

export const providerData: ProviderData = {
	'42': {
		createNewCredentialsUrl:
			'https://profile.intra.42.fr/oauth/applications/new',
		logoUrl: '/assets/svg/42-logo.svg',
		manageCredentialsUrl: 'https://profile.intra.42.fr/oauth/applications',
		name: '42',
		primaryColor: '#000000'
	},
	amazoncognito: {
		createNewCredentialsUrl:
			'https://console.aws.amazon.com/cognito/home#/user-pools',
		logoUrl: '/assets/svg/amazoncognito-logo.svg',
		manageCredentialsUrl:
			'https://console.aws.amazon.com/cognito/home#/user-pools',
		name: 'Amazon Cognito',
		primaryColor: '#DD344C'
	},

	anilist: {
		createNewCredentialsUrl: 'https://anilist.co/settings/developer',
		logoUrl: '/assets/svg/anilist-logo.svg',
		manageCredentialsUrl: 'https://anilist.co/settings/developer',
		name: 'AniList',
		primaryColor: '#02A9FF'
	},
	apple: {
		createNewCredentialsUrl:
			'https://developer.apple.com/account/resources/identifiers/add',
		logoUrl: '/assets/svg/apple-logo.svg',
		manageCredentialsUrl:
			'https://developer.apple.com/account/resources/identifiers/list',
		name: 'Apple',
		primaryColor: '#000000'
	},
	atlassian: {
		createNewCredentialsUrl:
			'https://developer.atlassian.com/console/myapps/',
		logoUrl: '/assets/svg/atlassian-logo.svg',
		manageCredentialsUrl: 'https://developer.atlassian.com/console/myapps/',
		name: 'Atlassian',
		primaryColor: '#0052CC'
	},
	auth0: {
		createNewCredentialsUrl: 'https://manage.auth0.com/#/applications',
		logoUrl: '/assets/svg/auth0-logo.svg',
		manageCredentialsUrl: 'https://manage.auth0.com/#/applications',
		name: 'Auth0',
		primaryColor: '#EB5424'
	},
	authentik: {
		createNewCredentialsUrl:
			'https://goauthentik.io/docs/add-secure-apps/providers/oauth2/create-oauth2-provider',
		logoUrl: '/assets/svg/authentik-logo.svg',
		manageCredentialsUrl:
			'https://goauthentik.io/docs/add-secure-apps/providers/oauth2/',
		name: 'Authentik',
		primaryColor: '#FD4B2D'
	},
	autodesk: {
		createNewCredentialsUrl:
			'https://aps.autodesk.com/hubs/@personal/applications/',
		logoUrl: '/assets/svg/autodesk-logo.svg',
		manageCredentialsUrl:
			'https://aps.autodesk.com/hubs/@personal/applications/',
		name: 'Autodesk',
		primaryColor: '#000000'
	},
	battlenet: {
		createNewCredentialsUrl: 'https://develop.battle.net/access/clients',
		logoUrl: '/assets/svg/battlenet-logo.svg',
		manageCredentialsUrl: 'https://develop.battle.net/access/clients',
		name: 'Battle.net',
		primaryColor: '#4381C3'
	},
	bitbucket: {
		createNewCredentialsUrl:
			'https://support.atlassian.com/bitbucket-cloud/docs/integrate-another-application-through-oauth',
		logoUrl: '/assets/svg/bitbucket-logo.svg',
		manageCredentialsUrl: 'https://bitbucket.org',
		name: 'Bitbucket',
		primaryColor: '#0052CC'
	},
	box: {
		createNewCredentialsUrl: 'https://app.box.com/developers/console',
		logoUrl: '/assets/svg/box-logo.svg',
		manageCredentialsUrl: 'https://app.box.com/developers/console',
		name: 'Box',
		primaryColor: '#0061D5'
	},
	bungie: {
		createNewCredentialsUrl: 'https://www.bungie.net/en/Application',
		logoUrl: '/assets/svg/bungie-logo.svg',
		manageCredentialsUrl: 'https://www.bungie.net/en/Application',
		name: 'Bungie',
		primaryColor: '#0075BB'
	},
	coinbase: {
		createNewCredentialsUrl: 'https://www.coinbase.com/settings/api',
		logoUrl: '/assets/svg/coinbase-logo.svg',
		manageCredentialsUrl: 'https://www.coinbase.com/settings/api',
		name: 'Coinbase',
		primaryColor: '#0052FF'
	},
	discord: {
		createNewCredentialsUrl: 'https://discord.com/developers/applications',
		logoUrl: '/assets/svg/discord-logo.svg',
		manageCredentialsUrl: 'https://discord.com/developers/applications',
		name: 'Discord',
		primaryColor: '#5865F2'
	},
	donationalerts: {
		createNewCredentialsUrl:
			'https://www.donationalerts.com/application/clients',
		logoUrl: '/assets/svg/DA_Alert_Color-Logo.svg',
		manageCredentialsUrl:
			'https://www.donationalerts.com/application/clients',
		name: 'Donation Alerts',
		primaryColor: '#F57D07'
	},
	dribbble: {
		createNewCredentialsUrl: 'https://dribbble.com/account/applications',
		logoUrl: '/assets/svg/dribbble-logo.svg',
		manageCredentialsUrl: 'https://dribbble.com/account/applications',
		name: 'Dribbble',
		primaryColor: '#EA4C89'
	},
	dropbox: {
		createNewCredentialsUrl: 'https://www.dropbox.com/developers/apps',
		logoUrl: '/assets/svg/dropbox-logo.svg',
		manageCredentialsUrl: 'https://www.dropbox.com/developers/apps',
		name: 'Dropbox',
		primaryColor: '#0061FF'
	},
	epicgames: {
		createNewCredentialsUrl: 'https://dev.epicgames.com/portal',
		logoUrl: '/assets/svg/epicgames-logo.svg',
		manageCredentialsUrl: 'https://dev.epicgames.com/portal',
		name: 'Epic Games',
		primaryColor: '#313131'
	},
	etsy: {
		createNewCredentialsUrl: 'https://www.etsy.com/developers/register',
		logoUrl: '/assets/svg/etsy-logo.svg',
		manageCredentialsUrl: 'https://www.etsy.com/developers/your-apps',
		name: 'Etsy',
		primaryColor: '#F16521'
	},
	facebook: {
		createNewCredentialsUrl: 'https://developers.facebook.com/apps/',
		logoUrl: '/assets/png/Facebook_Logo_Primary.png',
		manageCredentialsUrl: 'https://developers.facebook.com/apps/',
		name: 'Facebook',
		primaryColor: '#0866FF'
	},
	figma: {
		createNewCredentialsUrl: 'https://www.figma.com/developers/apps',
		logoUrl: '/assets/svg/Figma-Icon-(Full-color).svg',
		manageCredentialsUrl: 'https://www.figma.com/developers/apps',
		name: 'Figma',
		primaryColor: '#F24E1E'
	},
	gitea: {
		createNewCredentialsUrl: 'https://gitea.com/user/settings/applications',
		logoUrl: '/assets/svg/gitea-logo.svg',
		manageCredentialsUrl: 'https://gitea.com/user/settings/applications',
		name: 'Gitea',
		primaryColor: '#609926'
	},
	github: {
		createNewCredentialsUrl: 'https://github.com/settings/developers',
		logoUrl: '/assets/svg/GitHub_Invertocat_Dark.svg',
		manageCredentialsUrl: 'https://github.com/settings/developers',
		name: 'GitHub',
		primaryColor: '#181717'
	},
	gitlab: {
		createNewCredentialsUrl: 'https://gitlab.com/oauth/applications',
		logoUrl: '/assets/svg/gitlab-logo.svg',
		manageCredentialsUrl: 'https://gitlab.com/oauth/applications',
		name: 'GitLab',
		primaryColor: '#FC6D26'
	},
	google: {
		createNewCredentialsUrl:
			'https://console.cloud.google.com/apis/credentials',
		logoUrl: '/assets/svg/google-logo.svg',
		manageCredentialsUrl:
			'https://console.cloud.google.com/apis/credentials',
		name: 'Google',
		primaryColor: '#4285F4'
	},
	intuit: {
		createNewCredentialsUrl: 'https://developer.intuit.com/workspaces',
		logoUrl: '/assets/svg/intuit-logo.svg',
		manageCredentialsUrl: 'https://developer.intuit.com/workspaces',
		name: 'Intuit',
		primaryColor: '#236CFF'
	},
	kakao: {
		createNewCredentialsUrl: 'https://developers.kakao.com/apps',
		logoUrl: '/assets/svg/kakao-logo.svg',
		manageCredentialsUrl: 'https://developers.kakao.com/apps',
		name: 'Kakao',
		primaryColor: '#FFCD00'
	},
	keycloak: {
		createNewCredentialsUrl:
			'https://www.keycloak.org/docs/latest/server_admin/#_clients',
		logoUrl: '/assets/svg/keycloak-logo.svg',
		manageCredentialsUrl:
			'https://www.keycloak.org/docs/latest/server_admin/#_clients',
		name: 'Keycloak',
		primaryColor: '#4D4D4D'
	},
	kick: {
		createNewCredentialsUrl: 'https://kick.com/settings/developer',
		logoUrl: '/assets/svg/kick-logo.svg',
		manageCredentialsUrl: 'https://kick.com/settings/developer',
		name: 'Kick',
		primaryColor: '#53FC19'
	},
	lichess: {
		createNewCredentialsUrl:
			'https://lichess.org/api#section/Authentication',
		logoUrl: '/assets/svg/lichess-logo.svg',
		manageCredentialsUrl: 'https://lichess.org/api#section/Authentication',
		name: 'Lichess',
		primaryColor: '#000000'
	},
	line: {
		createNewCredentialsUrl: 'https://developers.line.biz/console',
		logoUrl: '/assets/png/LINE_Brand_icon.png',
		manageCredentialsUrl: 'https://developers.line.biz/console',
		name: 'LINE',
		primaryColor: '#00B900'
	},
	linear: {
		createNewCredentialsUrl: 'https://linear.app/absolutejs/settings/api',
		logoUrl: '/assets/svg/linear-logo.svg',
		manageCredentialsUrl: 'https://linear.app/absolutejs/settings/api',
		name: 'Linear',
		primaryColor: '#5E6AD2'
	},
	linkedin: {
		createNewCredentialsUrl: 'https://www.linkedin.com/developers/apps',
		logoUrl: '/assets/png/LI-In-Bug.png',
		manageCredentialsUrl: 'https://www.linkedin.com/developers/apps',
		name: 'LinkedIn',
		primaryColor: '#0077B5'
	},
	mastodon: {
		createNewCredentialsUrl:
			'https://mastodon.social/settings/applications',
		logoUrl: '/assets/svg/mastadon-logo-purple.svg',
		manageCredentialsUrl: 'https://mastodon.social/settings/applications',
		name: 'Mastodon',
		primaryColor: '#6364FF'
	},
	mercadolibre: {
		createNewCredentialsUrl:
			'https://developers.mercadolibre.com.ar/en_us/register-your-application',
		logoUrl: '/assets/jpeg/mercadolibre-logo.jpeg',
		manageCredentialsUrl:
			'https://developers.mercadolibre.com.ar/en_us/manage-your-applications',
		name: 'Mercado Libre',
		primaryColor: '#FFD100'
	},
	mercadopago: {
		createNewCredentialsUrl:
			'https://www.mercadopago.com.ar/developers/panel',
		logoUrl: '/assets/svg/mercadopago-logo.svg',
		manageCredentialsUrl: 'https://www.mercadopago.com.ar/developers/panel',
		name: 'Mercado Pago',
		primaryColor: '#00B1EA'
	},
	microsoftentraid: {
		createNewCredentialsUrl:
			'https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/CreateApplicationBlade/quickStartType~/null/isMSAApp',
		logoUrl: '/assets/svg/Microsoft-Entra-ID-color-icon.svg',
		manageCredentialsUrl:
			'https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps',
		name: 'Microsoft Entra ID',
		primaryColor: '#000000'
	},
	myanimelist: {
		createNewCredentialsUrl: 'https://myanimelist.net/apiconfig/create',
		logoUrl: '/assets/svg/myanimelist-logo.svg',
		manageCredentialsUrl: 'https://myanimelist.net/apiconfig',
		name: 'MyAnimeList',
		primaryColor: '#2E51A2'
	},
	naver: {
		createNewCredentialsUrl: 'https://developers.naver.com/apps/#/list',
		logoUrl: '/assets/png/naver-btnG_icon_circle.png',
		manageCredentialsUrl: 'https://developers.naver.com/apps/#/list',
		name: 'Naver',
		primaryColor: '#03C75A'
	},
	notion: {
		createNewCredentialsUrl: 'https://www.notion.so/my-integrations',
		logoUrl: '/assets/svg/notion-logo.svg',
		manageCredentialsUrl: 'https://www.notion.so/my-integrations',
		name: 'Notion',
		primaryColor: '#000000'
	},
	okta: {
		createNewCredentialsUrl: 'https://developer.okta.com/login/',
		logoUrl: '/assets/png/Okta_Wordmark_Black_S.png',
		manageCredentialsUrl: 'https://developer.okta.com/login/',
		name: 'Okta',
		primaryColor: '#007DC1'
	},
	osu: {
		createNewCredentialsUrl:
			'https://osu.ppy.sh/home/account/edit#new-oauth-application',
		logoUrl: '/assets/png/osu!logo.png',
		manageCredentialsUrl: 'https://osu.ppy.sh/home/account/edit#oauth',
		name: 'osu!',
		primaryColor: '#FF66AA'
	},
	patreon: {
		createNewCredentialsUrl:
			'https://www.patreon.com/portal/registration/register-clients',
		logoUrl: '/assets/svg/PATREON_SYMBOL_1_BLACK_RGB.svg',
		manageCredentialsUrl:
			'https://www.patreon.com/portal/registration/register-clients',
		name: 'Patreon',
		primaryColor: '#000000'
	},
	polar: {
		createNewCredentialsUrl: 'https://polar.sh/dashboard',
		logoUrl: '/assets/png/logomark_black.png',
		manageCredentialsUrl: 'https://polar.sh/dashboard',
		name: 'Polar',
		primaryColor: '#000000'
	},
	polaraccesslink: {
		createNewCredentialsUrl: 'https://admin.polaraccesslink.com',
		logoUrl: '/assets/png/Polar_logo_black_web.png',
		manageCredentialsUrl: 'https://admin.polaraccesslink.com',
		name: 'Polar Access Link',
		primaryColor: '#DF0827'
	},
	polarteampro: {
		createNewCredentialsUrl: 'https://admin.polaraccesslink.com',
		logoUrl: '/assets/png/Polar_logo_black_web.png',
		manageCredentialsUrl: 'https://admin.polaraccesslink.com',
		name: 'Polar Team Pro',
		primaryColor: '#DF0827'
	},
	reddit: {
		createNewCredentialsUrl: 'https://www.reddit.com/prefs/apps',
		logoUrl: '/assets/svg/Reddit_Icon_FullColor.svg',
		manageCredentialsUrl: 'https://www.reddit.com/prefs/apps',
		name: 'Reddit',
		primaryColor: '#FF4500'
	},
	roblox: {
		createNewCredentialsUrl:
			'https://create.roblox.com/dashboard/credentials?activeTab=OAuthTab',
		logoUrl: '/assets/svg/roblox-logo.svg',
		manageCredentialsUrl:
			'https://create.roblox.com/dashboard/credentials?activeTab=OAuthTab',
		name: 'Roblox',
		primaryColor: '#000000'
	},
	salesforce: {
		createNewCredentialsUrl: 'https://welcome.salesforce.com/',
		logoUrl: '/assets/svg/salesforce-logo.svg',
		manageCredentialsUrl: 'https://welcome.salesforce.com/',
		name: 'Salesforce',
		primaryColor: '#00A1E0'
	},
	shikimori: {
		createNewCredentialsUrl: 'https://shikimori.one/oauth/applications',
		logoUrl: '/assets/svg/shikimori-logo.svg',
		manageCredentialsUrl: 'https://shikimori.one/oauth/applications',
		name: 'Shikimori',
		primaryColor: '#343434'
	},
	slack: {
		createNewCredentialsUrl: 'https://api.slack.com/apps',
		logoUrl: '/assets/png/SLA-Slack-from-Salesforce-logo.png',
		manageCredentialsUrl: 'https://api.slack.com/apps',
		name: 'Slack',
		primaryColor: '#4A154B'
	},
	spotify: {
		createNewCredentialsUrl:
			'https://developer.spotify.com/dashboard/create',
		logoUrl: '/assets/svg/spotify-Primary_Logo_Green_RGB.svg',
		manageCredentialsUrl: 'https://developer.spotify.com/dashboard',
		name: 'Spotify',
		primaryColor: '#1ED760'
	},
	startgg: {
		createNewCredentialsUrl:
			'https://developer.start.gg/docs/authentication',
		logoUrl: '/assets/svg/start.gg_Icon_RGB.svg',
		manageCredentialsUrl: 'https://developer.start.gg/docs/authentication',
		name: 'Start.gg',
		primaryColor: '#2E75BA'
	},
	strava: {
		createNewCredentialsUrl: 'https://www.strava.com/settings/api',
		logoUrl: '/assets/svg/strava-logo.svg',
		manageCredentialsUrl: 'https://www.strava.com/settings/api',
		name: 'Strava',
		primaryColor: '#FC4C02'
	},
	synology: {
		createNewCredentialsUrl:
			'https://kb.synology.com/en-us/DSM/help/OAuthService/oauth_service_desc',
		logoUrl: '/assets/png/Synology_logo_Standard.png',
		manageCredentialsUrl:
			'https://kb.synology.com/en-us/DSM/help/OAuthService/oauth_service_desc',
		name: 'Synology',
		primaryColor: '#B5B5B6'
	},
	tiktok: {
		createNewCredentialsUrl: 'https://developers.tiktok.com/apps',
		logoUrl: '/assets/svg/tiktok-logo.svg',
		manageCredentialsUrl: 'https://developers.tiktok.com/apps',
		name: 'TikTok',
		primaryColor: '#000000'
	},
	tiltify: {
		createNewCredentialsUrl: 'https://app.tiltify.com/developers',
		logoUrl: '/assets/svg/rgb-tiltify22_mark_blue.svg',
		manageCredentialsUrl: 'https://app.tiltify.com/developers',
		name: 'Tiltify',
		primaryColor: '#143DF4'
	},
	tumblr: {
		createNewCredentialsUrl: 'https://www.tumblr.com/oauth/register',
		logoUrl: '/assets/png/Tumblr_Logos_2018.03.06_t_Icon_Blue.png',
		manageCredentialsUrl: 'https://www.tumblr.com/oauth/apps',
		name: 'Tumblr',
		primaryColor: '#36465D'
	},
	twitch: {
		createNewCredentialsUrl: 'https://dev.twitch.tv/console/apps/create',
		logoUrl: '/assets/svg/twitch-glitch_flat_purple.svg',
		manageCredentialsUrl: 'https://dev.twitch.tv/console/apps',
		name: 'Twitch',
		primaryColor: '#9146FF'
	},
	twitter: {
		createNewCredentialsUrl:
			'https://developer.twitter.com/en/portal/projects-and-apps',
		logoUrl: '/assets/png/twitter-logo-black.png',
		manageCredentialsUrl:
			'https://developer.twitter.com/en/portal/dashboard',
		name: 'Twitter / X',
		primaryColor: '#000000'
	},
	vk: {
		createNewCredentialsUrl: 'https://dev.vk.com/ru/admin/create-app',
		logoUrl: '/assets/svg/vk-logo.svg',
		manageCredentialsUrl: 'https://dev.vk.com/ru/admin/apps-list',
		name: 'VK',
		primaryColor: '#0077FF'
	},
	withings: {
		createNewCredentialsUrl:
			'https://developer.withings.com/dashboard/create',
		logoUrl: '/assets/png/logo_withings_black.png',
		manageCredentialsUrl: 'https://developer.withings.com/dashboard/',
		name: 'Withings',
		primaryColor: '#00A0DC'
	},
	workos: {
		createNewCredentialsUrl: 'https://dashboard.workos.com',
		logoUrl: '/assets/svg/workos-logo-color.svg',
		manageCredentialsUrl: 'https://dashboard.workos.com',
		name: 'WorkOS',
		primaryColor: '#6363F1'
	},
	yahoo: {
		createNewCredentialsUrl: 'https://developer.yahoo.com/apps/create/',
		logoUrl: '/assets/jpeg/yahoo-Icon.jpeg',
		manageCredentialsUrl: 'https://developer.yahoo.com/apps',
		name: 'Yahoo',
		primaryColor: '#5F01D1'
	},
	yandex: {
		createNewCredentialsUrl: 'https://oauth.yandex.com/client/new',
		logoUrl: '/assets/svg/yandex-icon_grad_circ.svg',
		manageCredentialsUrl: 'https://oauth.yandex.com/client/my',
		name: 'Yandex',
		primaryColor: '#5282FF'
	},
	zoom: {
		createNewCredentialsUrl: 'https://marketplace.zoom.us/develop/create',
		logoUrl: '/assets/png/Zoom_Logo_Bloom_RGB.png',
		manageCredentialsUrl: 'https://marketplace.zoom.us/user/build',
		name: 'Zoom',
		primaryColor: '#0B5CFF'
	}
};
