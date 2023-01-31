<script lang="ts">
	// import { page } from '$app/stores';
	import SvelteMarkdown from 'svelte-markdown';
	import type { PageData } from './$types';

	export let data: PageData;
	let source = data.pageInfo.content;
</script>

<div class="markdown">
	<SvelteMarkdown {source} />
</div>
