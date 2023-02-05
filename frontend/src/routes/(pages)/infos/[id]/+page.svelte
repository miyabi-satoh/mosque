<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import type { PageData } from './$types';

	export let data: PageData;
	$: source = data.info.attributes.text;
</script>

<div class="markdown">
	<SvelteMarkdown {source} />
</div>
