<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();
	function drawerClose(): void {
		drawerStore.close();
	}
	export let loggedIn: boolean;
	export let userMenus: string[][];
	const itemClasses = 'flex cursor-pointer rounded-full px-4 py-2 hover:bg-primary-500/10';

	$: classesActive = (href: string) => (href === $page.url.pathname ? '!bg-primary-500' : '');
</script>

{#if loggedIn}
	<nav class="p-4">
		<ul>
			{#each userMenus as [href, label, icon]}
				<li>
					<a {href} class="{itemClasses} {classesActive(href)}" on:click={drawerClose}>
						<Icon {icon} height="auto" />
						<span class="ml-2">{label}</span>
					</a>
				</li>
			{/each}
			<li>
				<label for="logout" class={itemClasses}>
					<Icon icon="mdi:logout" height="auto" />
					<span class="ml-2">Logout</span>
				</label>
			</li>
		</ul>
	</nav>
{/if}
