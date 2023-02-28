<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import '../app.postcss';
	import { userStore, type User } from '$lib/user';
	import Toast from '$lib/components/Toast.svelte';

	console.log(`frontend/src/routes/+layout.svelte`);
	export let data: LayoutData;
	// console.log(`userStore: ${$userStore}`);

	let loginError = '';
	let username = '';
	let password = '';
	let toggleLogin = false;
	$: if (toggleLogin) {
		setTimeout(() => {
			window.document.getElementById('username')?.focus();
		}, 100);
	}

	let theme: string;

	$: menuItems = data.menuItems;
	$: activeUrl = $page.url.pathname;

	function toggleTheme() {
		theme = theme == 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
		window.document.documentElement.setAttribute('data-theme', theme);
	}

	function handleToggleDrawer() {
		window.document.getElementById('drawer')?.click();
	}

	const handleEscKey = (event: KeyboardEvent) => {
		// console.log(event);
		if (event.key == 'Escape') {
			window.document.getElementById('login')?.click();
		}
	};

	const login = async () => {
		loginError = '';
		const res = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify({ username, password })
		});

		if (res.ok) {
			// const data: { user: User; jwt: string } = await res.json();
			const user: User = await res.json();
			// if (data) {
			if (user) {
				// setToken(data.jwt);
				$userStore = user;
				window.document.getElementById('login')?.click();
				window.location.reload();
			}
		} else {
			loginError = `ユーザー名またはパスワードが違います`;
			window.document.getElementById('username')?.focus();
			setTimeout(() => {
				loginError = '';
			}, 4000);
		}
		username = '';
		password = '';
	};

	const logout = async () => {
		await fetch('/api/auth/logout');
		// removeToken();
		$userStore = null;
		window.location.reload();
		// console.log($page.url);
	};

	onMount(async () => {
		theme = window.document.documentElement.getAttribute('data-theme') ?? '';
		const res = await fetch('/api/auth/me');
		if (res.ok) {
			const user: User = await res.json();
			if (data) {
				$userStore = user;
			}
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
	<input id="drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<div class="h-screen flex flex-col">
			<nav class="navbar">
				<div class="flex flex-1 gap-2">
					<label for="drawer" class="btn btn-square btn-ghost drawer-button lg:hidden">
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
								<li><button on:click={logout}>ログアウト</button></li>
							</ul>
						</div>
					{:else}
						<!-- The button to open modal -->
						<label for="login" class="btn btn-primary">ログイン</label>
					{/if}
					<button on:click={toggleTheme} class="mr-2">
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

<!-- Put this part before </body> tag -->
<input type="checkbox" id="login" class="modal-toggle" bind:checked={toggleLogin} />
<div class="modal">
	<form
		class="modal-box relative"
		action="#"
		on:submit|preventDefault={login}
		on:keyup={handleEscKey}
	>
		<label for="login" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		<div class="flex flex-col space-y-6">
			<h3 class="text-lg font-bold">ログイン</h3>
			<div>
				<label for="username" class="label label-text">ログイン名</label>
				<input
					class="input input-bordered w-full"
					id="username"
					type="text"
					required
					bind:value={username}
				/>
			</div>
			<div>
				<label for="password" class="label label-text">パスワード</label>
				<input
					class="input input-bordered w-full"
					id="password"
					type="password"
					required
					bind:value={password}
				/>
			</div>
			<button class="btn btn-primary" type="submit">ログイン</button>
			{#if loginError}
				<div class="alert alert-error shadow-lg" transition:fade>
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="stroke-current flex-shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/></svg
						>
						<span>{loginError}</span>
					</div>
				</div>
			{/if}
		</div>
	</form>
</div>
