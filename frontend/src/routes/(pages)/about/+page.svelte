<script lang="ts">
	import { page } from '$app/stores';
	import { P } from 'flowbite-svelte';
	import SvelteMarkdown from 'svelte-markdown';

	let source = $page?.data?.pageInfo?.content;
</script>

<div class="markdown">
	<SvelteMarkdown {source} />
</div>
