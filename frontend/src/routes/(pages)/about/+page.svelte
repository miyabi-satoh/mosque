<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: source = data.pageMeta?.content ?? '';
</script>

<Markdown {source} />
