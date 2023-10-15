<script lang="ts">
	import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
	import { commonmark } from '@milkdown/preset-commonmark';
	import { listener, listenerCtx } from '@milkdown/plugin-listener';
	import { gfm } from '@milkdown/preset-gfm';
	import { history } from '@milkdown/plugin-history';

	let className = '';
	export { className as class };
	export let placeholder: string | undefined = undefined;
	export let value: string = '';

	function editor(dom: Element) {
		// to obtain the editor instance we need to store a reference of the editor.
		const MakeEditor = Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, dom);
				ctx.set(defaultValueCtx, value);
				ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, _prevMarkdown) => {
					value = markdown;
				});
			})
			.use(commonmark)
			.use(gfm)
			.use(listener)
			.use(history)
			.create();
		MakeEditor.then((_editor) => {
			// here you have access to the editor instance.
			// const exampleContent = "# Hello World!";
			// editor.action(replaceAll(exampleContent));
		});
	}
</script>

<div class="marked relative {className}" use:editor>
	{#if placeholder && value.length === 0}
		<div class="placeholder">{placeholder}</div>
	{/if}
</div>
