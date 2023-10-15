<script lang="ts">
	import { Editor, rootCtx } from '@milkdown/core';
	import { commonmark } from '@milkdown/preset-commonmark';
	import { listener, listenerCtx } from '@milkdown/plugin-listener';
	import { gfm } from '@milkdown/preset-gfm';
	import { history } from '@milkdown/plugin-history';
	import { replaceAll } from '@milkdown/utils';

	let className = '';
	export { className as class };
	export let placeholder: string | undefined = undefined;
	export let value: string = '';
	export let name: string | undefined = undefined;

	let makeEditor: Editor;
	function editor(dom: Element) {
		console.log('editor', value);
		// to obtain the editor instance we need to store a reference of the editor.
		Editor.make()
			.config((ctx) => {
				console.log('config', value);
				ctx.set(rootCtx, dom);
				ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, _prevMarkdown) => {
					value = markdown;
				});
			})
			.use(commonmark)
			.use(gfm)
			.use(listener)
			.use(history)
			.create()
			.then((editor) => {
				editor.action(replaceAll(value));
				makeEditor = editor;
			});
	}

	export function clear() {
		makeEditor.action(replaceAll(''));
	}
</script>

<div class="marked relative {className}" use:editor>
	<input type="hidden" {name} {value} />
	{#if placeholder && value.length === 0}
		<div class="placeholder">{placeholder}</div>
	{/if}
</div>
