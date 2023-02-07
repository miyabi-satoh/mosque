<script lang="ts">
	import type { PageData } from './$types';
	import Markdown from '$lib/Markdown.svelte';

	export let data: PageData;
	$: source = data.info.data?.attributes?.text;
</script>

<Markdown {source} />
