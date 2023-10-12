<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { URLS } from '$lib/consts';
	import Icon from '@iconify/svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();
	function drawerClose(): void {
		drawerStore.close();
	}
	export let loggedIn: boolean;
	export let userMenus: string[][];
	const itemClasses = 'flex cursor-pointer rounded-full px-4 py-2 hover:bg-primary-500/10';

	$: classesActive = (href: string): string =>
		href === $page.url.pathname ? '!bg-primary-500' : '';
</script>

{#if loggedIn}
	<nav class="px-4">
		<ul>
			{#each userMenus as [href, label, icon]}
				<li>
					{#if href === ''}
						<hr class="my-2" />
					{:else}
						<a {href} class="{itemClasses} {classesActive(href)}" on:click={drawerClose}>
							<Icon {icon} height="auto" />
							<span class="ml-2">{label}</span>
						</a>
					{/if}
				</li>
			{/each}
			<li>
				<form
					method="POST"
					action={URLS.LOGOUT}
					use:enhance={() => {
						return async ({ update }) => {
							drawerClose();
							update();
						};
					}}
				>
					<button type="submit" class="w-full {itemClasses}">
						<Icon icon="mdi:logout" height="auto" />
						<span class="ml-2">Logout</span>
					</button>
				</form>
			</li>
		</ul>
	</nav>
{/if}
