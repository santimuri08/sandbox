import {
	isRefreshableProviderOption,
	isRevocableProviderOption,
	ProviderOption
} from '@absolutejs/auth';
import { Dispatch, SetStateAction } from 'react';
import { User } from '../../../../db/schema';
import { ThemeSprings } from '../../../types/springTypes';
import { ProviderInfo } from '../../data/providerData';
import { useAuthModalData } from '../../hooks/useAuthModalData';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { boxStyle, credentialLinkStyle } from '../../styles/authModalStyles';
import { HighlightedJson } from '../utils/HighlightedJson';
import { Modal } from '../utils/Modal';
import { ProviderAction } from './ProviderAction';

type AuthModalProps = {
	user: User | undefined;
	handleSignOut: () => Promise<void>;
	modalContent: (ProviderInfo & { providerOption: ProviderOption }) | null;
	setModalContent: Dispatch<
		SetStateAction<
			(ProviderInfo & { providerOption: ProviderOption }) | null
		>
	>;
	themeSprings: ThemeSprings;
};

export const AuthModal = ({
	modalContent,
	user,
	handleSignOut,
	setModalContent,
	themeSprings
}: AuthModalProps) => {
	if (!modalContent) return null;

	const { isSizeOrLess } = useMediaQuery();
	const isMobile = isSizeOrLess('sm');

	const primaryColor = modalContent?.primaryColor ?? '#000';
	const provider = user?.auth_sub?.split('|')[0]?.toLocaleLowerCase();

	const isAuthorized =
		provider !== undefined && modalContent?.providerOption === provider;
	const isRefreshable = isAuthorized && isRefreshableProviderOption(provider);
	const isRevocable = isAuthorized && isRevocableProviderOption(provider);

	const {
		fetchProfile,
		handleRefresh,
		handleRevocation,
		providerStatuses,
		profile,
		registerHost
	} = useAuthModalData({
		handleSignOut,
		modalContent
	});

	const actions: Array<{
		disabled: boolean;
		href?: string;
		keyName:
			| 'authorize_status'
			| 'profile_status'
			| 'refresh_status'
			| 'revoke_status';
		label: string;
		onClick?: () => Promise<void>;
	}> = [
		{
			disabled: false,
			href: `/oauth2/${modalContent.providerOption}/authorization`,
			keyName: 'authorize_status',
			label: 'Authorize User'
		},
		{
			disabled: !isAuthorized,
			keyName: 'profile_status',
			label: 'Fetch Profile',
			onClick: fetchProfile
		},
		{
			disabled: !isRefreshable,
			keyName: 'refresh_status',
			label: 'Refresh Token',
			onClick: handleRefresh
		},
		{
			disabled: !isRevocable,
			keyName: 'revoke_status',
			label: 'Revoke Token',
			onClick: handleRevocation
		}
	];

	return (
		<Modal
			style={{
				alignItems: 'stretch',
				backgroundColor: themeSprings.themeSecondary,
				border: `3px solid ${primaryColor}`,
				borderRadius: '8px',
				display: 'flex',
				flexDirection: 'column',
				gap: '24px',
				maxWidth: '95vw',
				padding: '32px',
				width: '500px'
			}}
			onOpen={(dialogRef) => registerHost(dialogRef)}
			isOpen={modalContent !== null}
			onClose={() => {
				const params = new URLSearchParams(window.location.search);
				params.delete('provider');

				const newQuery = params.toString();
				const newUrl = newQuery
					? `${window.location.pathname}?${newQuery}`
					: window.location.pathname;

				window.history.replaceState(null, '', newUrl);

				setModalContent(null);
				registerHost(null);
			}}
		>
			<h2
				style={{
					fontSize: isMobile ? '1.5rem' : '2rem',
					fontWeight: 'bold',
					margin: 0,
					textAlign: 'center'
				}}
			>
				{modalContent?.name}
			</h2>

			<img
				src={modalContent?.logoUrl}
				alt={`${modalContent?.name} logo`}
				style={{
					alignSelf: 'center',
					height: isMobile ? '60px' : '120px',
					width: isMobile ? '60px' : '120px'
				}}
			/>

			<nav style={{ display: 'flex', gap: '16px' }}>
				<a
					href={modalContent?.manageCredentialsUrl}
					style={credentialLinkStyle(primaryColor)}
					target="_blank"
					rel="noopener noreferrer"
				>
					Manage Credentials
				</a>
				<a
					href={modalContent?.createNewCredentialsUrl}
					style={credentialLinkStyle(primaryColor)}
					target="_blank"
					rel="noopener noreferrer"
				>
					Create New Credentials
				</a>
			</nav>

			{!isAuthorized && (
				<pre style={boxStyle(primaryColor, isMobile)}>
					<code>
						Authorize with this provider for this session to test.
					</code>
				</pre>
			)}

			{isAuthorized && !profile && (
				<pre style={boxStyle(primaryColor, isMobile)}>
					<code>Fetch your profile to see your data.</code>
				</pre>
			)}

			{isAuthorized && profile && (
				<HighlightedJson
					themeSprings={themeSprings}
					data={profile}
					primaryColor={primaryColor}
				/>
			)}

			<nav
				style={{
					display: 'grid',
					gap: '12px',
					gridTemplateColumns: '1fr 1fr'
				}}
			>
				{actions.map((action) => (
					<ProviderAction
						key={action.keyName}
						providerStatuses={providerStatuses}
						keyName={action.keyName}
						type={action.href ? 'link' : 'button'}
						href={action.href}
						disabled={action.disabled}
						label={
							isMobile
								? (action.label.split(' ')[0] ?? '')
								: (action.label ?? '')
						}
						onClick={action.onClick}
						color={primaryColor}
					/>
				))}
			</nav>
		</Modal>
	);
};
