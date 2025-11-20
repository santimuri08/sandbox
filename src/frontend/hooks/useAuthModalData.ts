/* eslint-disable absolute/max-depth-extended, @typescript-eslint/no-explicit-any */

import { ProviderOption } from '@absolutejs/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useToast } from '../components/utils/ToastProvider';
import { ProviderInfo } from '../data/providerData';
import { server } from '../eden/treaty';
import { getContrastColor } from '../styles/authModalStyles';
import { primaryColor } from '../styles/colors';

type UseAuthModalDataProps = {
	modalContent: (ProviderInfo & { providerOption: ProviderOption }) | null;
	handleSignOut: () => Promise<void>;
};

export const useAuthModalData = ({
	modalContent,
	handleSignOut
}: UseAuthModalDataProps) => {
	const { addToast, registerHost } = useToast();
	const [profile, setProfile] = useState<Record<string, unknown>>();
	const queryClient = useQueryClient();

	const providerStatuses = useQuery({
		queryKey: ['providerStatuses', modalContent?.providerOption],
		queryFn: async () => {
			if (modalContent === null) return null;

			const { data, error } = await server.api.v1
				.providers({ provider: modalContent.providerOption })
				.get();

			if (error) {
				throw new Error(
					`Failed to fetch provider status: ${error.value}`
				);
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { name, ...statuses } = data;

			return statuses;
		}
	});

	const showToast = (message: string, type: 'info' | 'success' | 'error') => {
		let style;
		switch (type) {
			case 'error':
				style = { background: '#f8d7da', color: '#721c24' };
				break;
			case 'success':
				style = { background: '#d4edda', color: '#155724' };
				break;
			case 'info':
				style = {
					background: primaryColor,
					color: getContrastColor(primaryColor)
				};
				break;
		}
		addToast({
			duration: type === 'error' ? 0 : undefined,
			message,
			style
		});
	};

	const handleRefresh = async () => {
		showToast('Refreshing token...', 'info');
		const refreshStatus = providerStatuses.data?.refresh_status;

		try {
			const response = await fetch('/oauth2/tokens', { method: 'POST' });

			if (!response.ok) throw new Error(await response.text());

			if (refreshStatus !== 'tested') {
				queryClient.invalidateQueries({
					queryKey: ['providerStatuses', modalContent?.providerOption]
				});
			}

			showToast('Token refreshed successfully!', 'success');
		} catch (error: any) {
			if (refreshStatus !== 'failed') {
				queryClient.invalidateQueries({
					queryKey: ['providerStatuses', modalContent?.providerOption]
				});
			}

			showToast(error.message, 'error');
		}
	};

	const handleRevocation = async () => {
		showToast('Revoking token...', 'info');
		const revokeStatus = providerStatuses.data?.revoke_status;

		try {
			const response = await fetch('/oauth2/revocation', {
				method: 'POST'
			});

			if (!response.ok) throw new Error(await response.text());

			if (revokeStatus !== 'tested') {
				queryClient.invalidateQueries({
					queryKey: ['providerStatuses', modalContent?.providerOption]
				});
			}

			showToast('Token revoked successfully!', 'success');
			handleSignOut();
			setProfile(undefined);
		} catch (error: any) {
			if (revokeStatus !== 'failed') {
				queryClient.invalidateQueries({
					queryKey: ['providerStatuses', modalContent?.providerOption]
				});
			}

			showToast(error.message, 'error');
		}
	};

	const fetchProfile = async () => {
		showToast('Fetching profile...', 'info');
		const profileStatus = providerStatuses.data?.profile_status;

		try {
			const response = await fetch('/oauth2/profile');

			if (!response.ok) throw new Error(await response.text());
			const data = await response.json();

			if (data.error !== undefined) throw new Error(data.error);

			if (profileStatus !== 'tested') {
				queryClient.invalidateQueries({
					queryKey: ['providerStatuses', modalContent?.providerOption]
				});
			}

			setProfile(data);
			showToast('Profile fetched successfully!', 'success');
		} catch (error: any) {
			if (profileStatus !== 'failed') {
				queryClient.invalidateQueries({
					queryKey: ['providerStatuses', modalContent?.providerOption]
				});
			}

			showToast(error.message, 'error');
		}
	};

	return {
		fetchProfile,
		handleRefresh,
		handleRevocation,
		profile,
		providerStatuses,
		registerHost
	};
};
