<script lang="ts">
	import {
		A,
		P,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<div class="w-full">
	{#if data.links.length > 0}
		<Table striped={true}>
			<TableHead>
				<TableHeadCell>Title</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each data.links as link (link?.id)}
					<TableBodyRow>
						<TableBodyCell
							><A target="_blank" href={link?.attributes?.url}>{link?.attributes?.title}</A
							></TableBodyCell
						>
						<TableBodyCell>{link?.attributes?.description}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{:else}
		<P class="w-full">データがありません</P>
	{/if}
</div>
