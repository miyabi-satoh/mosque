<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import { navigating } from '$app/stores';
	import { LoadingOverlay, Navigation } from '$lib';
	import { URLS } from '$lib/consts';
	import { loadingStore, submittingStore } from '$lib/stores';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import Icon from '@iconify/svelte';
	import {
		AppBar,
		AppShell,
		Drawer,
		LightSwitch,
		getDrawerStore,
		initializeStores,
		storePopup
	} from '@skeletonlabs/skeleton';
	import { onMount, tick } from 'svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	initializeStores();
	const drawerStore = getDrawerStore();
	async function drawerOpen() {
		drawerStore.open({});
		await tick();
		const el = window.document.querySelector('.drawer') as HTMLDivElement;
		if (el) {
			el.click();
		}
	}
	function drawerClose() {
		drawerStore.close();
	}

	export let data: LayoutData;
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

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

<form
	class="h-0 w-0"
	method="POST"
	action={URLS.LOGOUT}
	use:enhance={() => {
		return async ({ update }) => {
			drawerClose();
			update();
		};
	}}
>
	<button type="submit" id="logout" />
</form>

<Drawer width="w-64">
	<div class="pt-12">
		<Navigation loggedIn={!!data.user} userMenus={data.userMenus} />
	</div>
</Drawer>

<AppShell
	slotFooter="text-surface-500-400-token text-right text-sm p-4"
	slotSidebarLeft="w-0 lg:w-60"
	slotPageContent="flex flex-col flex-1 overflow-y-hidden container mx-auto lg:max-w-3xl"
	regionPage="overflow-y-hidden"
>
	<!-- Header Slot -->
	<svelte:fragment slot="header">
		<AppBar background="bg-surface-50-900-token">
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					{#if data.user}
						<button class="btn btn-sm lg:hidden" on:click={drawerOpen}>
							<Icon icon="mdi:menu" height="auto" />
						</button>
					{/if}
					<a href="/" class="text-xl uppercase">mosque</a>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if data.user}
					<div class="flex gap-x-2">
						<Icon icon="mdi:account-circle" height="auto" />
						{data.user.displayName}
					</div>
				{:else}
					<a href={URLS.LOGIN} title="Login">
						<Icon icon="mdi:login" height="auto" />
					</a>
				{/if}
				{#if data.user || !hasTouchScreen}
					<a href={URLS.BOARD} title="Board" class="hidden sm:block">
						<Icon icon="mdi:bulletin-board" height="auto" />
					</a>
				{/if}
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- Left Sidebar Slot -->
	<svelte:fragment slot="sidebarLeft">
		<Navigation loggedIn={!!data.user} userMenus={data.userMenus} />
	</svelte:fragment>

	<!-- Default Page Content Slot -->
	<slot />

	<!-- Footer Slot -->
	<svelte:fragment slot="footer">Copyright &copy; 2023 miyabi-satoh.</svelte:fragment>
</AppShell>
