<script lang="ts">
	import type { LayoutData } from './$types';
	import '../app.css';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { URLS } from '$lib/consts';
	import { loadingStore, submittingStore } from '$lib/stores';
	import { navigating } from '$app/stores';
	import { LoadingOverlay } from '$lib';

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { AppBar, LightSwitch, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data: LayoutData;
	let details: HTMLDetailsElement;

	onMount(() => {
		if (browser) {
			document.documentElement.addEventListener('click', () => {
				if (details?.open) {
					details.open = false;
				}
			});
		}
	});

	$: if ($navigating) $submittingStore = false;
	$: $loadingStore = !!$navigating || $submittingStore;

	const popupMenu: PopupSettings = {
		event: 'focus-click',
		target: 'popupMenu',
		placement: 'bottom',
		closeQuery: '.menu-item'
	};
</script>

<svelte:head>
	<title>MOSQUE</title>
</svelte:head>

{#if $loadingStore}
	<LoadingOverlay />
{/if}

<form class="h-0 w-0" method="POST" action={URLS.LOGOUT} use:enhance>
	<button type="submit" id="logout" />
</form>

<div class="flex h-screen flex-col">
	<div class="container mx-auto max-w-3xl">
		<AppBar background="bg-surface-50-900-token">
			<svelte:fragment slot="lead">
				<a href="/" class="btn-ghost btn text-xl normal-case">MOSQUE</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if data.user}
					<button class="btn flex gap-x-2" use:popup={popupMenu}>
						<Icon icon="mdi:account-circle" height="auto" />
						{data.user.username}
					</button>
					<div class="card w-52 p-2 shadow-xl" data-popup="popupMenu">
						<div class="flex flex-col gap-y-2">
							<a href={URLS.ADMIN} class="menu-item btn w-full hover:variant-filled-surface"
								>管理ページ</a
							>
							<label for="logout" class="menu-item btn w-full hover:variant-filled-surface"
								>ログアウト</label
							>
						</div>
					</div>
				{/if}
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</div>
	<slot />
	<footer class="text-surface-500-400-token p-4 text-right text-sm">
		Copyright &copy; 2023 miyabi-satoh.
	</footer>
</div>
