<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate, invalidate } from '$app/navigation';
	import { base } from '$app/paths';
	import { navigating, page } from '$app/stores';
	import { LoadingOverlay, Navigation } from '$lib';
	import { URLS } from '$lib/consts';
	import { innerScrollStore, loadingStore, submittingStore } from '$lib/stores';
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
	import '../app.css';
	import type { LayoutData } from './$types';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	// https://www.skeleton.dev/blog/how-to-implement-a-responsive-sidebar-drawer
	const drawerStore = getDrawerStore();
	async function drawerOpen() {
		drawerStore.open({});
	}

	export let data: LayoutData;
	$: overflowHidden = $innerScrollStore ? 'overflow-hidden' : '';
	$: breadcrumbs = $page.data.breadcrumbs;

	// https://stackoverflow.com/questions/71564541/going-back-to-the-previous-page-with-goto-sveltekit-navigation
	let previousPage: string = base;
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
		invalidate('auth:session');
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

<Drawer width="w-64">
	<div class="pt-12">
		<Navigation loggedIn={!!data.user} userMenus={data.userMenus} />
	</div>
</Drawer>

<AppShell
	slotFooter="text-surface-500-400-token text-right text-sm m-4"
	slotSidebarLeft="w-0 {data.user ? 'md:w-64' : ''}"
	slotPageContent="flex flex-col flex-1 container mx-auto lg:max-w-3xl {overflowHidden}"
	regionPage={overflowHidden}
>
	<!-- Header Slot -->
	<svelte:fragment slot="header">
		<AppBar background="bg-surface-50-900-token">
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					{#if data.user}
						<button class="btn btn-sm pl-0 lg:hidden" on:click={drawerOpen}>
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
					<a href={URLS.LOGIN} class="flex gap-x-2" title="Login">
						<Icon icon="mdi:login" height="auto" />
						<span class="hidden sm:inline">Login</span>
					</a>
				{/if}
				{#if data.user || data.isWindows}
					<a href={URLS.BOARD} title="Board" class="flex gap-x-2">
						<Icon icon="mdi:bulletin-board" height="auto" />
						<span class="hidden sm:inline">Board</span>
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

	<!-- Breadcrumbs -->
	<!-- {#key pathname} -->
	{#if breadcrumbs?.length > 1}
		<ol class="breadcrumb mx-4 mb-8 text-sm">
			{#each breadcrumbs as crumb, i}
				<!-- If crumb index is less than the breadcrumb length minus 1 -->
				{#if i < breadcrumbs.length - 1}
					<li class="crumb"><a class="anchor" href={crumb.link}>{crumb.label}</a></li>
					<li class="crumb-separator" aria-hidden>&rsaquo;</li>
				{:else}
					<li class="crumb">{crumb.label}</li>
				{/if}
			{/each}
		</ol>
	{/if}
	<!-- Default Page Content Slot -->
	<slot />

	<!-- Footer Slot -->
	<svelte:fragment slot="footer">Copyright &copy; 2023 miyabi-satoh.</svelte:fragment>
</AppShell>
