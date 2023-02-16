<script lang="ts">
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils';

	export let data: PageData;
	let infos = data.infos;
	let searchTerm = '';

	$: filterdItems = getFilterdItems(searchTerm) || [];
	function getFilterdItems(term: string) {
		if (term.length == 0) {
			return infos.data;
		}
		return infos.data?.filter(
			(info) => info.attributes?.text?.includes(term) || info.attributes?.title?.includes(term)
		);
	}
</script>

{#if infos.data?.length && infos.data.length > 0}
	<div class="my-8 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 not-prose">
		{#each filterdItems as item (item.id)}
			<a
				class="card card-compact border-2 border-base-200 bg-white/5 hover:bg-gray-300/10 transition-all duration-200 hover:shadow hover:-translate-y-1"
				href="/infos/{item.id}"
			>
				<div class="card-body">
					<p color="text-sm">{formatDate(item.attributes.updatedAt)}</p>
					<h3 class="card-title">
						{item.attributes.title}
					</h3>
					<p class="h-12 line-clamp-2">{item.attributes.text}</p>
				</div>
			</a>
		{/each}
	</div>
{:else}
	<p>データがありません</p>
{/if}
