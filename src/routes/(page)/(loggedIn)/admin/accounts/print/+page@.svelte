<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import './style.css';

	export let data: PageData;
	const { form } = superForm(data.form);
</script>

<div id="svg-wrapper">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html $form.svg ?? ''}
</div>

<style lang="postcss">
	@media screen {
		#svg-wrapper {
			@apply flex h-full w-full flex-col items-center overflow-scroll;
		}
	}
</style>
