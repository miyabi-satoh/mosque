<script lang="ts">
	import type { LayoutData } from './$types';
	import '../app.css';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';

	export let data: LayoutData;
	let details: HTMLDetailsElement;

	onMount(() => {
		if (browser) {
			document.documentElement.addEventListener('click', () => {
				if (details.open) {
					details.open = false;
				}
			});
			details.onclick = (e: Event) => {
				e.stopPropagation();
			};
		}
	});
</script>

<svelte:head>
	<title>MOSQUE</title>
</svelte:head>

<form class="h-0 w-0" method="POST" action="/?/logout" use:enhance>
	<button type="submit" id="logout" />
</form>

<div class="flex h-screen flex-col">
	<div class="container mx-auto max-w-3xl">
		<div class="navbar bg-base-100">
			<div class="flex-1">
				<a href="/" class="btn btn-ghost text-xl normal-case">MOSQUE</a>
			</div>
			<div class="flex-none">
				{#if data.user}
					<details class="dropdown dropdown-end" bind:this={details}>
						<summary class="btn btn-ghost flex gap-x-2">
							<Icon icon="mdi:account-circle" height="auto" />
							{data.user.username}
						</summary>
						<ul
							class="menu dropdown-content z-[1] w-52 rounded-md border border-base-content/25 bg-base-100 p-2"
						>
							<li><label for="logout">ログアウト</label></li>
						</ul>
					</details>
				{/if}
			</div>
		</div>
	</div>
	<slot />
	<footer class="p-4 text-right text-sm text-base-content/50">
		Copyright &copy; 2023 miyabi-satoh.
	</footer>
</div>
