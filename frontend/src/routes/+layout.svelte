<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		// NavHamburger,
		Span,
		DarkMode,
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		Footer,
		FooterCopyright,
		Button,
		Dropdown,
		DropdownItem,
		DropdownDivider,
		Drawer,
		CloseButton
	} from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import Icon from '@iconify/svelte';
	import '../app.postcss';
	import { page } from '$app/stores';
	import LoginModal from '$lib/LoginModal.svelte';
	import { getLocalToken, removeLocalToken } from '$lib/utils';
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { createMediaQueryStore, mainStore } from '$stores';

	let openLoginModal = false;
	let hiddenMainMenu = true;
	let fixedMainMenu = false;
	let mql;
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	$: data = $page.data;
	$: activeUrl = $page.url.pathname;
	$: handleChangeMinWidth($mql !== undefined);
	function handleChangeMinWidth(changed: boolean) {
		if (changed) {
			hiddenMainMenu = !$mql;
			fixedMainMenu = !hiddenMainMenu;
			// console.log(fixedMainMenu);
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
					const response = await api.getMe(token);
					mainStore.setLoggedIn(true);
					mainStore.setUserProfile(response.data);
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
		<button
			class="mx-2 hover:text-gray-900 text-gray-500 dark:text-gray-400 dark:hover:text-white  hover:bg-gray-100 dark:hover:bg-gray-600 ml-3 lg:hidden"
			on:click={() => (hiddenMainMenu = false)}
		>
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
				<Button size="sm" on:click={() => (openLoginModal = true)}>ログイン</Button>
			{/if}
			<LoginModal bind:open={openLoginModal} />
			<DarkMode class="ml-2" />
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
		divClass="overflow-y-auto z-50 p-4 bg-gray-50 dark:bg-gray-800"
		leftOffset="left-0 lg:top-14 h-screen pb-32"
		width="w-64"
		backdrop={false}
	>
		<div class="flex items-center">
			<CloseButton on:click={() => (hiddenMainMenu = true)} class="dark:text-white lg:hidden" />
		</div>
		<Sidebar asideClass="w-54">
			<SidebarWrapper>
				<SidebarGroup>
					{#each data.menuItems as menuItem (menuItem?.id)}
						<SidebarItem
							label={menuItem?.title}
							href={menuItem?.url}
							active={activeUrl === menuItem?.url}
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
	<!-- </div> -->
	<div class="flex px-4 mx-auto w-full">
		<main class="lg:ml-72 w-full mx-auto">
			<slot />
		</main>
	</div>
	<div class="mx-auto mb-4 pt-4 lg:pl-64">
		<Footer footerType="socialmedia" class="dark:!bg-gray-900">
			<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
			<div class="sm:flex sm:items-center sm:justify-between">
				<FooterCopyright href="/" by="miyabi-satoh" year={2023} />
			</div>
		</Footer>
	</div>
</div>
