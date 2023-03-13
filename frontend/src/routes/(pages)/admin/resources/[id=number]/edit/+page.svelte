<script lang="ts">
	import ResourceForm from '$lib/components/form/ResourceForm.svelte';
	import { MSG } from '$lib/constants';
	import type { ResourceUpdate } from '$lib/resource';
	import type { ActionData, PageData } from './$types';

	console.log(`/routes/(pages)/admin/resources/[id=number]/edit/+page.svelte`);
	export let data: PageData;
	export let form: ActionData;
	let resourceData: ResourceUpdate;

	resourceData = {
		title: data.resource?.title ?? '',
		description: data.resource?.description ?? ''
	};
</script>

{#if data.resource}
	<ResourceForm data={resourceData} errors={form?.errors} />
{:else}
	<p>{MSG.TARGET_NOT_FOUND}</p>
{/if}
