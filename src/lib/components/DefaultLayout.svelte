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
		Modal,
		getDrawerStore,
		initializeStores,
		storePopup
	} from '@skeletonlabs/skeleton';
	import '../../app.postcss';
	import type { LayoutData } from '../../routes/$types';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	// https://www.skeleton.dev/blog/how-to-implement-a-responsive-sidebar-drawer
	const drawerStore = getDrawerStore();
	function drawerOpen(): void {
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
	<div class="pt-16">
		<Navigation loggedIn={!!data.user} userMenus={data.userMenus} />
	</div>
</Drawer>

<Modal />

<AppShell
	slotFooter="text-surface-500-400-token text-right text-sm m-4"
	slotSidebarLeft="w-0 {data.user ? 'lg:w-64' : ''}"
	slotPageContent="flex flex-col flex-1 container mx-auto lg:max-w-4xl {overflowHidden}"
	regionPage={overflowHidden}
>
	<!-- Header Slot -->
	<svelte:fragment slot="header">
		<AppBar background="bg-surface-50-900-token">
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button
						class="btn btn-sm pl-0 lg:invisible"
						class:invisible={!data.user}
						on:click={drawerOpen}
					>
						<span><Icon icon="mdi:menu" height="auto" /></span>
					</button>
					<a href="/" class="hidden text-xl uppercase sm:block">mosque</a>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if data.showBoard}
					<a href={URLS.BOARD} title="Board" class="hidden gap-x-2 sm:flex">
						<Icon icon="mdi:bulletin-board" height="auto" />
						<span class="hidden sm:inline">Board</span>
					</a>
				{/if}
				{#if data.user}
					<div class="flex items-center gap-x-2">
						<Icon icon="mdi:account-circle" height="auto" />
						<span class="text-sm sm:text-base">{data.user.displayName}</span>
					</div>
				{:else}
					<a href={URLS.LOGIN} class="flex gap-x-2" title="Login">
						<Icon icon="mdi:login" height="auto" />
						<span>Login</span>
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
