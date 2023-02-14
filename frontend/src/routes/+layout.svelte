<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import LoginModal from '$lib/LoginModal.svelte';
	import { getLocalToken, removeLocalToken } from '$lib/utils';
	import { mainStore } from '$stores';
	import { apiAuth } from '$lib/api';
	import '../app.postcss';

	let openLoginModal = false;
	let theme: string;
	export let data: LayoutData;
	$: menuItems = data.menuItems;
	$: activeUrl = $page.url.pathname;

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

	function toggleTheme() {
		theme = theme == 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
		window.document.documentElement.setAttribute('data-theme', theme);
	}

	onMount(async () => {
		theme = window.document.documentElement.getAttribute('data-theme') ?? '';

		await checkLoggedIn();
	});
</script>

<svelte:head>
	<script>
		if (window) {
			localStorage.getItem('theme') === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
				? window.document.documentElement.setAttribute('data-theme', 'dark')
				: window.document.documentElement.setAttribute('data-theme', 'light');
		}
	</script>
</svelte:head>

<div class="drawer drawer-mobile bg-base-100">
	<input id="drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<nav class="navbar">
			<div class="flex flex-1 gap-2">
				<label for="drawer" class="btn btn-square btn-ghost drawer-button lg:hidden">
					<Icon icon="mdi:apps" height="46" />
				</label>
				<a href="/" class="btn btn-ghost lg:hidden">
					<span class="text-lg md:text-3xl text-primary uppercase">MOSQUE</span>
				</a>
			</div>
			<div class="flex flex-none gap-2">
				{#if $mainStore.isLoggedIn}
					<ul class="menu menu-horizontal px-1">
						<li tabindex="-1">
							<span
								><Icon icon="mdi:user-circle" height="auto" />
								{$mainStore.userProfile?.email}</span
							>
							<ul class="p-2">
								<li>設定</li>
								<li class="divider" />
								<li><button on:click={removeLogin}>ログアウト</button></li>
							</ul>
						</li>
					</ul>
				{:else}
					<button class="btn btn-primary" on:click={() => (openLoginModal = true)}>ログイン</button>
				{/if}
				<button on:click={toggleTheme} class="btn btn-square btn-ghost">
					{#if theme == 'dark'}
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1
        0 100-2H3a1 1 0 000 2h1z"
								fill-rule="evenodd"
								clip-rule="evenodd"
							/>
						</svg>
					{:else}
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
						</svg>
					{/if}
				</button>
				<LoginModal bind:open={openLoginModal} />
			</div>
		</nav>
		<main class="prose w-full max-w-4xl px-4">
			<slot />
		</main>
		<div class="bg-base-content/10 h-px my-6" />
		<footer class="footer pb-6 px-4 gap-y-0 sm:grid-flow-col">
			<div class="justify-self-center sm:justify-self-start">
				© 2023 miyabi-satoh . All Rights Reserved.
			</div>
			<div class="justify-self-center sm:justify-self-end">
				<a class="link" href="/about">About</a>
			</div>
		</footer>
	</div>
	<div class="drawer-side">
		<label for="drawer" class="drawer-overlay" />
		<aside class="bg-base-200 w-64">
			<div class="z-20 sticky top-0 px-4 py-2">
				<div class="flex justify-end lg:hidden">
					<label for="drawer" class="btn btn-sm btn-circle drawer-button m-4">
						<Icon icon="mdi:close" />
					</label>
				</div>
				<div class="hidden lg:block">
					<a href="/" class="btn btn-ghost px-2">
						<span class="text-lg md:text-3xl text-primary uppercase">MOSQUE</span>
					</a>
				</div>
			</div>
			<ul class="menu px-4 lg:mt-6">
				{#each menuItems.data as menuItem (menuItem.id)}
					<li>
						<a
							class={activeUrl === menuItem.attributes.url ? 'active' : ''}
							href={menuItem.attributes.url}>{menuItem.attributes.title}</a
						>
					</li>
				{/each}
			</ul>
		</aside>
	</div>
</div>
