<script lang="ts">
	import type { PageData } from './$types';
	import Markdown from '$lib/components/Markdown.svelte';

	export let data: PageData;
	$: source = data.info.text ?? '';
</script>

<Markdown {source} />
