import { PROVIDER_STATUSES } from '../../../constants';
import { FailedBadge } from '../testing/badges/FailedBadge';
import { LoadingBadge } from '../testing/badges/LoadingBadge';
import { MissingBadge } from '../testing/badges/MissingBadge';
import { TestedBadge } from '../testing/badges/TestedBadge';
import { TestingBadge } from '../testing/badges/TestingBadge';
import { UntestedBadge } from '../testing/badges/UntestedBadge';

export const renderBadge = (
	status: (typeof PROVIDER_STATUSES)[number] | undefined
) => {
	switch (status) {
		case 'tested':
			return <TestedBadge />;
		case 'untested':
			return <UntestedBadge />;
		case 'testing':
			return <TestingBadge />;
		case 'missing':
			return <MissingBadge />;
		case 'failed':
			return <FailedBadge />;
		default:
			return <LoadingBadge />;
	}
};
