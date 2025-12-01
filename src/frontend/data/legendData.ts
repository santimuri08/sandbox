import { PROVIDER_STATUSES } from '../../constants';

export type LegendData = {
	status: (typeof PROVIDER_STATUSES)[number];
	message: string;
};

export const legendData: LegendData[] = [
	{
		message: 'Verified routes actively working and community-tested.',
		status: 'tested'
	},
	{
		message: 'Pending external or restricted access.',
		status: 'untested'
	},
	{
		message: 'Feature currently under development on our end.',
		status: 'testing'
	},
	{
		message: 'Functionality not supported by the provider.',
		status: 'missing'
	},
	{
		message: 'Library or endpoint issues (not user error).',
		status: 'failed'
	}
];
