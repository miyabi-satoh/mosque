import { tick } from 'svelte';

export function scrollToBottom(node: Element, behavior: ScrollBehavior | undefined = undefined) {
	const doScrollToBottom = (node: Element, behavior: ScrollBehavior) => {
		if (Math.abs(node.scrollHeight - node.clientHeight - node.scrollTop) >= 1) {
			node.scrollTo({ top: node.scrollHeight, behavior });
		}
	};

	if (behavior !== undefined) {
		tick().then(() => {
			doScrollToBottom(node, behavior!);
			behavior = undefined;
		});
	}

	return {
		destroy() {},
		update(behavior: ScrollBehavior | undefined) {
			if (behavior !== undefined) {
				tick().then(() => {
					doScrollToBottom(node, behavior!);
					behavior = undefined;
				});
			}
		}
	};
}
