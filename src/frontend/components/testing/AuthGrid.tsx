import {
	isValidProviderOption,
	ProviderOption,
	providerOptions
} from '@absolutejs/auth';
import { useState } from 'react';
import { User } from '../../../../db/schema';
import { ThemeSprings } from '../../../types/springTypes';
import { providerData, ProviderInfo } from '../../data/providerData';
import { OAuthButton } from '../auth/OAuthButton';
import { ToastProvider } from '../utils/ToastProvider';
import { AuthModal } from './AuthModal';

type AuthGridProps = {
	user: User | undefined;
	handleSignOut: () => Promise<void>;
	themeSprings: ThemeSprings;
};

export const AuthGrid = ({
	user,
	handleSignOut,
	themeSprings
}: AuthGridProps) => {
	const [modalContent, setModalContent] = useState<
		(ProviderInfo & { providerOption: ProviderOption }) | null
	>(() => {
		if (typeof window === 'undefined') return null;
		const params = new URLSearchParams(window.location.search);
		const raw = params.get('provider');
		if (raw && isValidProviderOption(raw)) {
			const data = providerData[raw];

			return {
				createNewCredentialsUrl: data.createNewCredentialsUrl,
				logoUrl: data.logoUrl,
				manageCredentialsUrl: data.manageCredentialsUrl,
				name: data.name,
				primaryColor: data.primaryColor,
				providerOption: raw
			};
		}

		return null;
	});

	return (
		<ToastProvider>
			<div
				style={{
					display: 'grid',
					gap: '12px',
					gridTemplateColumns:
						'repeat(auto-fill, minmax(180px, 1fr))',
					margin: '0 auto 2rem',
					maxWidth: '1200px',
					width: '90%'
				}}
			>
				{providerOptions.map((provider) => (
					<OAuthButton
						themeSprings={themeSprings}
						key={provider}
						provider={provider}
						setModalContent={setModalContent}
					/>
				))}
			</div>

			<AuthModal
				themeSprings={themeSprings}
				handleSignOut={handleSignOut}
				user={user}
				modalContent={modalContent}
				setModalContent={setModalContent}
			/>
		</ToastProvider>
	);
};
