<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { LayoutData } from './$types';
	import DarkMode from './DarkMode.svelte';
	import { page } from '$app/stores';
	import '../app.postcss';
	import { API, ID_MODALS, MIME_JSON } from '$lib/constants';
	import { userType } from '$lib/user';
	import { fields } from '$lib/fields';
	import { invalidateAll } from '$app/navigation';
	import Modal, { closeModal } from '$lib/components/organisms/Modal.svelte';
	import Toast from '$lib/components/organisms/Toast.svelte';
	import InputText from '$lib/components/molecules/InputText.svelte';
	console.log(`/routes/+layout.svelte`);

	const ID_LOGIN = 'login-modal';
	const ID_DRAWER = 'drawer';
	const ID_USERNAME = 'login-username';

	export let data: LayoutData;
	let loginError = '';
	let username = '';
	let password = '';
	$: menuItems = data.menuItems;
	$: activeUrl = $page.url.pathname;

	function handleToggleDrawer() {
		window.document.getElementById(ID_DRAWER)?.click();
	}

	const handleToggleLoginModal = async (event: Event) => {
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
			closeModal(ID_LOGIN);
			window.location.reload();
		} else {
			loginError = `ユーザー名またはパスワードが違います`;
			window.document.getElementById(ID_USERNAME)?.focus();
		}
	};

	const handleLogout = async () => {
		await fetch(API.LOGOUT);
		invalidateAll();
	};
</script>

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
				<div class="flex flex-none gap-4 mr-2">
					{#if data.user}
						<div class="dropdown dropdown-end">
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label tabindex="0" class="btn btn-ghost">
								<Icon icon="mdi:user-circle" height="auto" class="sm:mr-1" />
								<span class="hidden sm:inline">
									{data.user.displayName}
								</span>
							</label>
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<ul tabindex="0" class="menu dropdown-content shadow bg-base-300 w-56 rounded">
								<li class="sm:hidden"><button disabled>{data.user.displayName}</button></li>
								{#if data.user.type === userType.sysadmin}
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
					<DarkMode />
				</div>
			</nav>
			<main class="flex-1 flex flex-col w-full overflow-y-scroll">
				<div class="flex-1 w-full prose max-w-4xl px-4 mx-auto">
					<slot />
				</div>
				<div class="divider my-2" />
				<footer class="footer px-4 mb-2 gap-y-0 sm:grid-flow-col">
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
				<InputText id={ID_USERNAME} required bind:value={username}
					>{fields.user.username.label}</InputText
				>
			</div>
			<div>
				<InputText type="password" required bind:value={password}
					>{fields.user.password.label}</InputText
				>
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
