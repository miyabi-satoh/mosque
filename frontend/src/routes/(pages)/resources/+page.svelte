<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;
	$: stateResources = data.resources.data;
	// $: resourcesMeta = data.resources.meta;

	let searchTerm = '';

	// $: filterdItems = getFilterdItems(searchTerm);
	// function getFilterdItems(term: string) {
	// 	if (term.length == 0) {
	// 		return resourcesData;
	// 	}
	// 	return resourcesData.filter((resource) => resource.attributes.keywords.includes(term));
	// }
</script>

<div class="py-4 flex flex-col md:flex-row gap-2">
	<input
		bind:value={searchTerm}
		type="text"
		placeholder="Search keywords..."
		class="input input-bordered md:flex-1"
	/>
</div>

{#if stateResources && stateResources.length > 0}
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 not-prose">
		{#each stateResources as resource (resource.id)}
			<a
				class="card card-compact border-2 border-base-200 bg-base-300/25 hover:bg-gray-300/10 transition-all duration-200 hover:shadow hover:-translate-y-1"
				href="{$page.url.pathname}/{resource.id}"
			>
				<div class="card-body">
					<h3 class="card-title">{resource.attributes.title}</h3>
					<p>{resource.attributes.description ?? ''}</p>
					<div class="card-actions">
						{#each resource.attributes.assets.data as asset}
							<div class="badge badge-outline">{asset.attributes.slug}</div>
						{/each}
					</div>
				</div>
			</a>
		{/each}
	</div>
{:else}
	<p>データがありません</p>
{/if}
