<script lang="ts">
	import type { IBreadcrumbItemParam } from '$schemas';
	import Icon from '@iconify/svelte';

	export let params: IBreadcrumbItemParam[];
</script>

<div class="text-sm breadcrumbs not-prose mb-8">
	<ul>
		{#each params as { href, name }, index}
			<li>
				{#if index == params.length - 1}
					{name}
				{:else}
					<a {href} class="link link-hover">
						{#if href == '/'}
							<Icon icon="mdi:home" class="mr-2" />
						{/if}
						{name}
					</a>
				{/if}
			</li>
		{/each}
	</ul>
</div>
