<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import type { User } from '@prisma/client';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import '../app.postcss';
	import { userStore } from '$lib/user';
	import Toast from '$lib/components/Toast.svelte';
	import { API, ID_MODALS, MIME_JSON } from '$lib/constants';
	import Label from '$lib/components/form/Label.svelte';
	import InputText from '$lib/components/form/InputText.svelte';
	import Modal, { closeModal, showModal } from '$lib/components/Modal.svelte';

	const ID_LOGIN = 'login-modal';
	const ID_DRAWER = 'drawer';
	const ID_USERNAME = 'login-username';
	const ID_PASSWORD = 'login-password';

	console.log(`frontend/src/routes/+layout.svelte`);
	export let data: LayoutData;
	let loginError = '';
	let username = '';
	let password = '';
	let theme: string;
	$: menuItems = data.menuItems;
	$: activeUrl = $page.url.pathname;

	function handleToggleTheme() {
		theme = theme == 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
		window.document.documentElement.setAttribute('data-theme', theme);
	}

	function handleToggleDrawer() {
		window.document.getElementById(ID_DRAWER)?.click();
	}

	const handleToggleLoginModal = (event: Event) => {
		console.log(`handleToggleLoginModal`);
		const checked = (event.target as HTMLInputElement).checked;
		if (checked) {
			username = '';
			password = '';
			setTimeout(() => {
				window.document.getElementById(ID_USERNAME)?.focus();
			}, 100);
		}
	};

	const handleEscKey = (event: KeyboardEvent) => {
		if (event.key == 'Escape') {
			closeModal(ID_LOGIN);
		}
	};

	const handleLogin = async () => {
		loginError = '';
		const res = await fetch(API.LOGIN, {
			method: 'POST',
			headers: { 'Content-Type': MIME_JSON, Accept: MIME_JSON },
			body: JSON.stringify({ username, password })
		});

		if (res.ok) {
			const user: User = await res.json();
			if (user) {
				$userStore = user;
				closeModal(ID_LOGIN);
				window.location.reload();
			}
		} else {
			loginError = `ユーザー名またはパスワードが違います`;
			window.document.getElementById(ID_USERNAME)?.focus();
		}
	};

	const handleLogout = async () => {
		await fetch(API.LOGOUT);
		$userStore = null;
		window.location.reload();
	};

	onMount(async () => {
		theme = window.document.documentElement.getAttribute('data-theme') ?? '';
		const res = await fetch(API.ME);
		if (res.ok) {
			const user: User = await res.json();
			$userStore = user;
		}
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

<Toast />
<div class="drawer drawer-mobile bg-base-100">
	<input id={ID_DRAWER} type="checkbox" class="drawer-toggle" />
	<div class="drawer-content relative z-10">
		<div class="h-screen flex flex-col">
			<nav class="navbar">
				<div class="flex flex-1 gap-2">
					<label for={ID_DRAWER} class="btn btn-square btn-ghost drawer-button lg:hidden">
						<Icon icon="mdi:apps" height="46" />
					</label>
					<a href="/" class="lg:hidden">
						<span class="text-xl sm:text-3xl font-bold text-base-content uppercase">MOSQUE</span>
					</a>
				</div>
				<div class="flex flex-none gap-2">
					{#if $userStore}
						<div class="dropdown dropdown-end">
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label tabindex="0" class="btn btn-ghost">
								<Icon icon="mdi:user-circle" height="auto" class="sm:mr-1" />
								<span class="hidden sm:inline">
									{$userStore.displayName}
								</span>
							</label>
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<ul tabindex="0" class="menu dropdown-content shadow bg-base-300 w-56 rounded">
								<li class="sm:hidden"><button disabled>{$userStore.displayName}</button></li>
								{#if $userStore.id == 1}
									<li><a href="/admin">管理ページ</a></li>
								{/if}
								<li><a href="/me">プロフィール確認・編集</a></li>
								<li><a href="/passwd">パスワード変更</a></li>
								<li><button on:click={handleLogout}>ログアウト</button></li>
							</ul>
						</div>
					{:else}
						<!-- The button to open modal -->
						<label for={ID_LOGIN} class="btn btn-primary">ログイン</label>
					{/if}
					<button on:click={handleToggleTheme} class="mr-2">
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
				</div>
			</nav>
			<main class="flex-1 flex flex-col w-full overflow-y-scroll">
				<div class="flex-1 w-full prose max-w-4xl px-4 mx-auto">
					<slot />
				</div>
				<div class="divider" />
				<footer class="footer mt-2 mb-6 px-4 gap-y-0 sm:grid-flow-col">
					<div class="justify-self-center sm:justify-self-start">
						© 2023 miyabi-satoh . All Rights Reserved.
					</div>
					<div class="justify-self-center sm:justify-self-end">
						<a class="link" href="/about">About</a>
					</div>
				</footer>
			</main>
		</div>
	</div>
	<div class="drawer-side">
		<label for={ID_DRAWER} class="drawer-overlay" />
		<aside class="bg-base-200 w-64 relative">
			<div class="z-20 sticky top-0 px-4 py-2">
				<div class="flex justify-end lg:hidden">
					<label for={ID_DRAWER} class="btn btn-sm btn-circle drawer-button m-4">
						<Icon icon="mdi:close" />
					</label>
				</div>
				<div class="hidden lg:block">
					<a href="/" class="btn btn-ghost px-2">
						<span class="text-lg md:text-3xl text-base-content uppercase">MOSQUE</span>
					</a>
				</div>
			</div>
			<ul class="menu px-4 lg:mt-6">
				{#each menuItems as menuItem (menuItem.id)}
					<li>
						<a
							class={activeUrl === menuItem.url ? 'active' : ''}
							href={menuItem.url}
							on:click={handleToggleDrawer}
						>
							{menuItem.title}</a
						>
					</li>
				{/each}
			</ul>
		</aside>
	</div>
</div>

<div id={ID_MODALS} class="prose" />

<Modal id={ID_LOGIN} on:change={handleToggleLoginModal}>
	<h3 class="text-lg font-bold">ログイン</h3>
	<form on:keyup={handleEscKey}>
		<div class="flex flex-col space-y-6">
			<div>
				<Label for={ID_USERNAME}>ログイン名</Label>
				<InputText id={ID_USERNAME} required bind:value={username} />
			</div>
			<div>
				<Label for={ID_PASSWORD}>パスワード</Label>
				<InputText id={ID_PASSWORD} type="password" required bind:value={password} />
			</div>
			{#if loginError}
				<div class="bg-error text-error-content p-4">
					{loginError}
				</div>
			{/if}
			<button class="btn btn-primary" on:click|preventDefault={handleLogin}>ログイン</button>
		</div>
	</form>
</Modal>
