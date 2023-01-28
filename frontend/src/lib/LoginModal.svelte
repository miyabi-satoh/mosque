<script lang="ts">
	import { Button, Modal, Label, Input, Heading, Span } from 'flowbite-svelte';
	import { api } from './api';
	import type { AxiosError } from 'axios';
	import { mainStore } from '$stores';

	export let open = false;
	let username = '';
	let password = '';
	let elInput: Input;

	async function handleSubmitLogin() {
		try {
			const response = await api.getAccessToken(username, password);
			const token = response.data.access_token;
			if (token) {
				mainStore.setToken(token);
				mainStore.setLoggedIn(true);
				mainStore.setLogInError(false);
				await actionGetUserProfile();
				mainStore.addNotification({ content: 'Logged in', color: 'success' });
				open = false;
			} else {
				mainStore.setLoggedIn(false);
			}
		} catch (err) {
			mainStore.setLogInError(true);
			mainStore.setLoggedIn(false);
		}
	}

	async function actionGetUserProfile() {
		try {
			const response = await api.getMe($mainStore.token);
			if (response.data) {
				mainStore.setUserProfile(response.data);
			}
		} catch (error) {
			actionCheckApiError(error as AxiosError);
		}
	}

	function actionCheckApiError(payload: AxiosError) {
		if (payload.response && payload.response.status === 401) {
			mainStore.setLoggedIn(false);
		}
	}

	$: if (elInput) {
		document.getElementById('username')?.focus();
	}
</script>

<Modal bind:open size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" action="#" on:submit|preventDefault={handleSubmitLogin}>
		<Heading tag="h3" class="p-0" customSize="text-xl font-medium">ログイン</Heading>
		<Label class="space-y-2">
			<Span>ログイン名</Span>
			<Input bind:this={elInput} id="username" type="text" required bind:value={username} />
		</Label>
		<Label class="space-y-2">
			<Span>パスワード</Span>
			<Input id="password" type="password" required bind:value={password} />
		</Label>
		<Button type="submit">ログイン</Button>
	</form>
</Modal>
