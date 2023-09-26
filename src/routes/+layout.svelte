<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { navigating } from '$app/stores';
	import { LoadingOverlay } from '$lib';
	import { URLS } from '$lib/consts';
	import { loadingStore, submittingStore } from '$lib/stores';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import Icon from '@iconify/svelte';
	import {
		AppBar,
		LightSwitch,
		popup,
		storePopup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	// 参考 - https://zenn.dev/gawarago/articles/f75f5113a3803d
	// ページ遷移が起きた場合はsubmittingストアをリセット
	$: if (browser && !!$navigating) $submittingStore = false;
	// ページ遷移中もしくはsubmitting
	$: $loadingStore = (browser && !!$navigating) || $submittingStore;

	const popupMenu: PopupSettings = {
		event: 'focus-click',
		target: 'popupMenu',
		placement: 'bottom',
		closeQuery: '.menu-item'
	};
</script>

<svelte:head>
	<title>MOSQUE</title>
</svelte:head>

{#if $loadingStore}
	<LoadingOverlay />
{/if}

<form class="h-0 w-0" method="POST" action={URLS.LOGOUT} use:enhance>
	<button type="submit" id="logout" />
</form>

<div class="flex h-screen flex-col">
	<div class="container mx-auto lg:max-w-3xl">
		<AppBar background="bg-surface-50-900-token">
			<svelte:fragment slot="lead">
				<a href="/" class="btn-ghost btn text-xl normal-case">MOSQUE</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if data.user}
					<button class="btn flex gap-x-2" use:popup={popupMenu}>
						<Icon icon="mdi:account-circle" height="auto" />
						{data.user.username}
					</button>
					<div class="card w-52 p-2 shadow-xl" data-popup="popupMenu">
						<div class="flex flex-col gap-y-2">
							{#each data.userMenus as [href, label]}
								<a {href} class="menu-item btn w-full hover:variant-filled-surface">{label}</a>
							{/each}
							<label for="logout" class="menu-item btn w-full hover:variant-filled-surface"
								>ログアウト</label
							>
						</div>
					</div>
				{/if}
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</div>
	<slot />
	<footer class="text-surface-500-400-token p-4 text-right text-sm">
		Copyright &copy; 2023 miyabi-satoh.
	</footer>
</div>
