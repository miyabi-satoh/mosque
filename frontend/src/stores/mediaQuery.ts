import { writable } from 'svelte/store';

export function createMediaQueryStore(mediaQueryString: string) {
	const { subscribe, set } = writable<boolean>(undefined, () => {
		const mql = window.matchMedia(mediaQueryString);

		set(mql.matches);

		const onchange = () => set(mql.matches);

		mql.addEventListener('change', onchange);

		return () => {
			mql.removeEventListener('change', onchange);
		};
	});

	return { subscribe };
}
