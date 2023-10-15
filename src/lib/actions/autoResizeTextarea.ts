export function autoResizeTextarea(el: HTMLElement): void {
	// console.log(`autoResizeTextarea`);
	el.style.height = 'auto';
	el.style.height = `${el.scrollHeight}px`;
}

export function autoResize(node: HTMLTextAreaElement) {
	function onInput() {
		autoResizeTextarea(node);
	}

	autoResizeTextarea(node);
	node.addEventListener('input', onInput);

	return {
		destroy() {
			node.removeEventListener('input', onInput);
		}
	};
}
