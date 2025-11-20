import { useEffect } from 'react';

export const useCleanPath = () => {
	// Remove harmless OAuth fragments inserted by Facebook and Reddit
	useEffect(() => {
		const { hash } = window.location;
		if (hash === '#_=_' || hash === '#_') {
			// Strip the fragment without reloading the page
			window.history.replaceState(
				null,
				document.title,
				window.location.pathname + window.location.search
			);
		}
	}, []);
};
