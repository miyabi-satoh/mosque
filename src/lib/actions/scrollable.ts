export function scrollable(node: HTMLElement) {
	// #page-content配下をチェック
	const root = node.closest('#page-content');
	if (!root) return;

	const elemArray: HTMLElement[] = [];
	let elem = node.parentElement;
	while (elem) {
		if (
			!elem.classList.contains('overflow-hidden') &&
			!elem.classList.contains('overflow-y-hidden')
		) {
			elem.classList.add('overflow-hidden');
			elemArray.push(elem);
			// console.log(elem);
		}
		if (elem.id === root.id) {
			break;
		}
		elem = elem.parentElement;
	}
	node.classList.add('overflow-scroll');

	return {
		destroy() {
			elemArray.forEach((elem) => elem.classList.remove('overflow-hidden'));
		}
	};
}
