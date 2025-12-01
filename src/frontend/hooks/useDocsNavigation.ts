import { useEffect, useState } from 'react';
import { isValidViewId } from '../../types/typeGuards';
import { DocsView } from '../../types/types';

export const useDocsNavigation = (initialView: DocsView) => {
	const [view, setView] = useState(initialView);

	const navigateToView = (newView: DocsView) => {
		const { pathname, search, hash } = window.location;
		const trimmed = pathname.replace(/\/+$/, '');
		const parts = trimmed.split('/').filter(Boolean);

		const last = parts.length > 0 ? parts[parts.length - 1] : undefined;

		if (last && isValidViewId(last)) {
			parts[parts.length - 1] = newView;
		} else {
			parts.push(newView);
		}

		const nextPath = `/${parts.join('/')}`;
		if (nextPath !== pathname) {
			window.history.pushState(
				{ view: newView },
				'',
				`${nextPath}${search}${hash}`
			);
		}
		setView(newView);
	};

	useEffect(() => {
		const onPop = () => {
			const trimmed = window.location.pathname.replace(/\/+$/, '');
			const parts = trimmed.split('/').filter(Boolean);
			const last = parts.length > 0 ? parts[parts.length - 1] : undefined;
			if (last && isValidViewId(last)) setView(last);
		};
		window.addEventListener('popstate', onPop);

		return () => window.removeEventListener('popstate', onPop);
	}, []);

	return [view, navigateToView] as const;
};
