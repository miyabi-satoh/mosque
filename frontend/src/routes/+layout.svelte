<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		// NavHamburger,
		Span,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		Drawer,
		CloseButton
	} from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import type { LayoutData } from './$types';
	import Footer from './footer.svelte';
	import { page } from '$app/stores';
	import LoginModal from '$lib/LoginModal.svelte';
	import { getLocalToken, removeLocalToken } from '$lib/utils';
	import { createMediaQueryStore, mainStore } from '$stores';
	import { apiAuth } from '$lib/api';
	import '../app.postcss';

	let openLoginModal = false;
	let hiddenMainMenu = true;
	let fixedMainMenu = false;
	let mql;
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	export let data: LayoutData;
	$: menuItems = data.menuItems;
	$: activeUrl = $page.url.pathname;
	$: handleChangeMinWidth($mql !== undefined);
	function handleChangeMinWidth(changed: boolean) {
		if (changed) {
			hiddenMainMenu = !$mql;
			fixedMainMenu = !hiddenMainMenu;
		}
	}

	async function checkLoggedIn() {
		if (!$mainStore.isLoggedIn) {
			let token = $mainStore.token;
			if (!token) {
				const localToken = getLocalToken();
				if (localToken) {
					mainStore.setToken(localToken);
					token = localToken;
				}
			}
			if (token) {
				try {
					const profile = await apiAuth.getMe(fetch, token);
					mainStore.setLoggedIn(true);
					mainStore.setUserProfile(profile);
				} catch (error) {
					removeLogin();
				}
			} else {
				removeLogin();
			}
		}
	}

	function removeLogin() {
		removeLocalToken();
		mainStore.setToken('');
		mainStore.setLoggedIn(false);
	}

	onMount(async () => {
		mql = createMediaQueryStore('(min-width: 1024px)');
		themeChange(false);

		await checkLoggedIn();
	});
</script>

<div class="mx-auto">
	<Navbar
		let:hidden
		let:toggle
		navClass="px-2 py-2 fixed w-full mx-auto z-20 top-0 left-0 border-b"
		navDivClass="mx-auto flex flex-wrap items-center"
	>
		<button class="mx-2 ml-3 lg:hidden" on:click={() => (hiddenMainMenu = false)}>
			<span class="sr-only">Open main menu</span>
			<Icon icon="mdi:apps" height="46" />
		</button>

		<NavBrand href="/">
			<Span class="self-center whitespace-nowrap text-xl font-semibold lg:ml-4">MOSQUE</Span>
		</NavBrand>
		<div class="flex-1" />
		<div class="flex md:order-2">
			{#if $mainStore.isLoggedIn}
				<NavUl>
					<NavLi id="account-menu" class="flex items-center cursor-pointer">
						<Icon icon="mdi:user-circle" height="auto" />
						{$mainStore.userProfile?.email}
					</NavLi>
				</NavUl>
				<Dropdown placement="bottom" triggeredBy="#account-menu">
					<DropdownItem>設定</DropdownItem>
					<DropdownDivider />
					<DropdownItem on:click={removeLogin}>ログアウト</DropdownItem>
				</Dropdown>
			{:else}
				<button class="btn btn-primary" on:click={() => (openLoginModal = true)}>ログイン</button>
			{/if}
			<LoginModal bind:open={openLoginModal} />
			<button data-toggle-theme="night,fantasy" data-act-class="ACTIVECLASS">TEST</button>
			<!-- <DarkMode class="ml-2" /> -->
			<!-- <NavHamburger on:click={toggle} /> -->
		</div>
		<!-- <NavUl {hidden} class="order-1">
			<NavLi href="/" active={true}>Home</NavLi>
			<NavLi href="/about">About</NavLi>
			<NavLi href="/services">Services</NavLi>
			<NavLi href="/pricing">Pricing</NavLi>
			<NavLi href="/contact">Contact</NavLi>
		</NavUl> -->
	</Navbar>
	<!-- <div
		id="sidebar"
		class="overflow-y-auto z-50 p-4 bg-gray-50 dark:bg-gray-800 w-64 fixed lg:top-14 h-screen lg:left-0 overflow-scroll pb-32"
		tabindex="-1"
		aria-controls="sidebar"
		aria-labelledby="sidebar"
		style=""
	> -->
	<Drawer
		transitionType="fly"
		{transitionParams}
		activateClickOutside={!fixedMainMenu}
		bind:hidden={hiddenMainMenu}
		id="sidebar"
		divClass="overflow-y-auto z-50 p-4 "
		leftOffset="left-0 lg:top-14 h-screen pb-32"
		width="w-64"
		backdrop={false}
	>
		<div class="flex items-center">
			<CloseButton on:click={() => (hiddenMainMenu = true)} class=" lg:hidden" />
		</div>
		<Sidebar asideClass="w-54">
			<SidebarWrapper>
				<SidebarGroup>
					{#each menuItems.data as menuItem (menuItem.id)}
						<SidebarItem
							label={menuItem.attributes.title}
							href={menuItem.attributes.url}
							active={activeUrl === menuItem.attributes.url}
							on:click={() => (hiddenMainMenu = fixedMainMenu ? false : true)}
						/>
					{/each}
					<!-- <SidebarDropdownWrapper label="E-commerce" isOpen={activeUrl.includes('/components/')}>
					<SidebarDropdownItem
						label="Products"
						href="/components/products"
						active={activeUrl === '/components/products'}
					/>
					<SidebarDropdownItem
						label="Sidebar"
						href="/components/sidebar"
						active={activeUrl === '/components/sidebar'}
					/>
				</SidebarDropdownWrapper>
				<SidebarDropdownWrapper label="Items">
					<SidebarDropdownItem
						label="Item 1"
						href="/components/item1"
						active={activeUrl === '/components/item'}
					/>
					<SidebarDropdownItem
						label="Item 2"
						href="/components/item2"
						active={activeUrl === '/components/billing'}
					/>
				</SidebarDropdownWrapper> -->
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
	</Drawer>
	<div class="flex px-4 mx-auto w-full">
		<main class="lg:ml-72 w-full mx-auto">
			<slot />
		</main>
	</div>
	<Footer />
</div>
