<script lang="ts">
	import Markdown from '$lib/components/organisms/Markdown.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: source = data.pageMeta?.content ?? '';
</script>

<Markdown {source} />
