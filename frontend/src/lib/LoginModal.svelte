<script lang="ts">
	import { Button, Modal, Label, Input, Heading, Span } from 'flowbite-svelte';
	import { api } from './api';
	import { mainState } from './stores';
	import type { AxiosError } from 'axios';
  import { onMount } from 'svelte';

	export let open = false;
	let username = '';
	let password = '';
  let elInput: Input

	async function handleSubmitLogin() {
		try {
			const response = await api.getAccessToken(username, password);
			const token = response.data.access_token;
			if (token) {
				mainState.setToken(token);
				mainState.setLoggedIn(true);
				mainState.setLogInError(false);
				await actionGetUserProfile();
				mainState.addNotification({ content: 'Logged in', color: 'success' });
				open = false;
			} else {
				mainState.setLoggedIn(false);
			}
		} catch (err) {
			mainState.setLogInError(true);
			mainState.setLoggedIn(false);
		}
	}

	async function actionGetUserProfile() {
		try {
			const response = await api.getMe($mainState.token);
			if (response.data) {
				mainState.setUserProfile(response.data);
			}
		} catch (error) {
			actionCheckApiError(error as AxiosError);
		}
	}

	function actionCheckApiError(payload: AxiosError) {
		if (payload.response!.status === 401) {
			mainState.setLoggedIn(false);
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
			<Input bind:this={elInput} id="username" type="text" required bind:value={username}/>
		</Label>
		<Label class="space-y-2">
			<Span>パスワード</Span>
			<Input id="password" type="password" required bind:value={password} />
		</Label>
		<Button type="submit">ログイン</Button>
	</form>
</Modal>
