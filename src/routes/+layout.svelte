<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import { navigating } from '$app/stores';
	import { LoadingOverlay } from '$lib';
	import { URLS } from '$lib/consts';
	import { loadingStore, submittingStore } from '$lib/stores';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import Icon from '@iconify/svelte';
	import {
		AppBar,
		LightSwitch,
		popup,
		storePopup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	const popupMenu: PopupSettings = {
		event: 'click',
		target: 'popupMenu',
		placement: 'bottom'
	};

	let hasTouchScreen = false;
	onMount(() => {
		if (browser) {
			hasTouchScreen = (() => {
				if (window.navigator.maxTouchPoints > 0) {
					return true;
				}
				if (window.matchMedia('(pointer:coarse)').matches) {
					return true;
				}
				if ('orientation' in window) {
					return true; // deprecated, but good fallback
				}
				return false;
			})();
		}
	});

	// https://stackoverflow.com/questions/71564541/going-back-to-the-previous-page-with-goto-sveltekit-navigation
	let previousPage: string = base;
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});

	// https://zenn.dev/gawarago/articles/f75f5113a3803d
	$: if (browser && !!$navigating) $submittingStore = false;
	$: $loadingStore = (browser && !!$navigating) || $submittingStore;
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
	<div class="container mx-auto lg:max-w-3xl">
		<AppBar background="bg-surface-50-900-token">
			<svelte:fragment slot="lead">
				<a href={previousPage}><Icon icon="mdi:arrow-left" height="36" /></a>
			</svelte:fragment>
			<h1 class="h1"><a href="/">MOSQUE</a></h1>
			<svelte:fragment slot="trail">
				{#if data.user}
					<button class="btn flex gap-x-2" use:popup={popupMenu}>
						<Icon icon="mdi:account-circle" height="auto" />
						{data.user.displayName}
					</button>
					<div class="card z-30 w-60 p-2 shadow-xl" data-popup="popupMenu">
						<div class="flex flex-col gap-y-2">
							{#each data.userMenus as [href, label, icon]}
								<a {href} class="btn w-full justify-start text-left hover:variant-filled-surface">
									<Icon {icon} height="auto" />
									<span class="ml-2">{label}</span>
								</a>
							{/each}
							<label
								for="logout"
								class="btn w-full justify-start text-left hover:variant-filled-surface"
							>
								<Icon icon="mdi:logout" height="auto" />
								<span class="ml-2">Logout</span>
							</label>
						</div>
					</div>
				{:else}
					<a href={URLS.LOGIN} title="Login">
						<Icon icon="mdi:login" height="auto" />
					</a>
				{/if}
				{#if data.user || !hasTouchScreen}
					<a href={URLS.BOARD} title="Board">
						<Icon icon="mdi:bulletin-board" height="auto" />
					</a>
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
