<script lang="ts">
	import { Editor, rootCtx } from '@milkdown/core';
	import { commonmark } from '@milkdown/preset-commonmark';
	import { listener, listenerCtx } from '@milkdown/plugin-listener';
	import { gfm } from '@milkdown/preset-gfm';
	import { history } from '@milkdown/plugin-history';
	import { replaceAll } from '@milkdown/utils';
	import { createEventDispatcher } from 'svelte';

	let className = '';
	export { className as class };
	export let placeholder: string | undefined = undefined;
	export let value: string = '';
	export let name: string | undefined = undefined;

	const dispatch = createEventDispatcher();
	function onKeydown(e: Event) {
		dispatch('keydown', e as KeyboardEvent);
	}

	let makeEditor: Editor;
	let innerValue: string;
	function editor(dom: Element) {
		Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, dom);
				ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, prevMarkdown) => {
					if (markdown !== prevMarkdown) {
						innerValue = value = markdown;
					}
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
				const el = dom.getElementsByClassName('editor');
				if (el && el.length > 0) {
					el[0].addEventListener('keydown', onKeydown);
				}
			});
	}

	$: if (makeEditor && innerValue !== value) {
		makeEditor.action(replaceAll(value));
	}
</script>

<div class="marked relative {className}" use:editor>
	<input type="hidden" {name} {value} />
	{#if placeholder && value.length === 0}
		<div class="placeholder">{placeholder}</div>
	{/if}
</div>
