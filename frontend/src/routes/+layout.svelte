<script lang="ts">
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
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
		DropdownDivider
	} from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import '../app.postcss';
	import { page } from '$app/stores';
	import LoginModal from '$lib/LoginModal.svelte';
	import { mainState } from '$lib/stores';
	import { getLocalToken, removeLocalToken } from '$lib/utils';
	import { api } from '$lib/api';
	import { onMount } from 'svelte';
	import type { IMenuItem } from '$lib/interfaces';

	let openLoginModal = false;
	let menuItems: IMenuItem[] = [];

	$: activeUrl = $page.url.pathname;

	async function checkLoggedIn() {
		if (!$mainState.isLoggedIn) {
			let token = $mainState.token;
			if (!token) {
				const localToken = getLocalToken();
				if (localToken) {
					mainState.setToken(localToken);
					token = localToken;
				}
			}
			if (token) {
				try {
					const response = await api.getMe(token);
					mainState.setLoggedIn(true);
					mainState.setUserProfile(response.data);
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
		mainState.setToken('');
		mainState.setLoggedIn(false);
	}

	onMount(async () => {
		await checkLoggedIn();
		try {
			const response = await api.getMenus();
			if (response.data) {
				menuItems = response.data;
			}
		} catch (error) {
			console.log(`getMenus() error`, error);
		}
	});
</script>

<div class="mx-auto">
	<Navbar
		let:hidden
		let:toggle
		navClass="px-2 py-0.5 fixed w-full mx-auto z-50 top-0 left-0 border-b"
		navDivClass="mx-auto flex flex-wrap justify-between items-center h-14"
	>
		<NavBrand href="/">
			<Span class="self-center whitespace-nowrap text-xl font-semibold">MOSQUE</Span>
		</NavBrand>
		<div class="flex md:order-2">
			{#if $mainState.isLoggedIn}
				<NavUl>
					<NavLi id="account-menu" class="flex items-center cursor-pointer">
						<Icon icon="mdi:user-circle" height="auto" />
						{$mainState.userProfile?.email}
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
			<DarkMode />
			<NavHamburger on:click={toggle} />
		</div>
		<!-- <NavUl {hidden} class="order-1">
			<NavLi href="/" active={true}>Home</NavLi>
			<NavLi href="/about">About</NavLi>
			<NavLi href="/services">Services</NavLi>
			<NavLi href="/pricing">Pricing</NavLi>
			<NavLi href="/contact">Contact</NavLi>
		</NavUl> -->
	</Navbar>
	<div
		id="sidebar"
		class="overflow-y-auto z-20 p-4 bg-white dark:bg-gray-800 w-64 fixed lg:top-14 h-screen lg:left-0 overflow-scroll pb-32"
		tabindex="-1"
		aria-controls="sidebar"
		aria-labelledby="sidebar"
		style=""
	>
		<div class="flex items-center">
			<button
				type="button"
				class="ml-auto focus:outline-none whitespace-normal rounded-lg focus:ring-2 p-1.5 focus:ring-gray-300  hover:bg-gray-100 dark:hover:bg-gray-700 mb-4 dark:text-white lg:hidden"
				aria-label="Close"
			>
				<span class="sr-only">Close</span>
				<svg
					class="w-5 h-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
		<Sidebar asideClass="w-54">
			<SidebarWrapper>
				<SidebarGroup>
					<SidebarItem label="Test" href="/test" active={activeUrl === '/test'} />
					{#each menuItems as menuItem (menuItem.id)}
						<SidebarItem
							label={menuItem.title}
							href={menuItem.url}
							active={activeUrl === menuItem.url}
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
	</div>
	<div class="flex px-4 mx-auto w-full">
		<main class="lg:ml-72 w-full mx-auto">
			<!-- <div class="container flex flex-wrap max-auto mt-20"> -->
			<slot />
			<!-- </div> -->
		</main>
		<slot name="sub" />
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
