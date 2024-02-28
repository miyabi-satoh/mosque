<script lang="ts">
	import { page } from '$app/stores';
	import { FormLabel, HelperText, SubmitButton } from '$lib';
	import { userRoles } from '$lib/consts';
	import { submittingStore } from '$lib/stores';
	import Icon from '@iconify/svelte';
	import {
		FileButton,
		getModalStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import CropModal from './CropModal.svelte';

	const modalStore = getModalStore();

	export let data: PageData;
	const { form, message, errors, submitting, constraints, enhance } = superForm(data.form, {
		resetForm: false
	});
	$: $submittingStore = $submitting;

	function onFileChange(event: Event): void {
		const inp = event.target as HTMLInputElement;
		if (inp.files) {
			const reader = new FileReader();
			reader.readAsDataURL(inp.files[0]);
			reader.onload = (e) => {
				const component: ModalComponent = { ref: CropModal };
				const modal: ModalSettings = {
					type: 'component',
					component,
					meta: {
						image: e.target?.result?.toString() ?? ''
					},
					response: (r: string) => {
						if (r) {
							$form.avatar = r;
						}
					}
				};
				// clear input file.
				inp.value = '';
				modalStore.trigger(modal);
			};
		}
	}

	function onAvatarClick() {
		if ($form.avatar) {
			$form.avatar = '';
		} else {
			const el = window.document.querySelector('input[name="select-image"]');
			if (el) {
				(el as HTMLInputElement).click();
			}
		}
	}
</script>

<form class="mx-4 space-y-4" method="post" enctype="multipart/form-data" use:enhance>
	{#if $message}
		<HelperText usePageStatus>{$message}</HelperText>
	{/if}
	<div class="italic">Required fields are marked with an asterisk (*).</div>
	<div class="flex flex-col sm:flex-row sm:gap-x-8">
		<div class="mx-auto w-32 space-y-2">
			<FileButton
				button="bg-surface-200-700-token border-surface-900/25 w-full rounded-xl border-2"
				name="select-image"
				accept="image/*"
				multiple={false}
				on:change={onFileChange}
			>
				{#if $form.avatar}
					<img src={$form.avatar} class="border-surf w-full rounded-xl" alt="avatar" />
				{:else}
					<Icon icon="mdi:account" class="mx-auto" height="96" />
				{/if}
			</FileButton>

			<button type="button" class="variant-filled btn btn-sm w-full" on:click={onAvatarClick}>
				<span>{$form.avatar ? 'Clear' : 'Select'} avatar</span>
			</button>
			<input type="hidden" name="avatar" bind:value={$form.avatar} />
		</div>
		<div class="sm:flex-1">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<FormLabel text="Login ID" constraint={$constraints.username}>
						<input
							class="input"
							class:input-error={$errors.username}
							type="text"
							name="username"
							bind:value={$form.username}
							disabled={$submitting}
							autocomplete="username"
							{...$constraints.username}
						/>
					</FormLabel>
					<HelperText>
						{$errors.username ? $errors.username[0] : ''}
					</HelperText>
				</div>
				<div>
					<FormLabel text="Display Name" constraint={$constraints.displayName}>
						<input
							class="input"
							class:input-error={$errors.displayName}
							type="text"
							name="displayName"
							bind:value={$form.displayName}
							disabled={$submitting}
							{...$constraints.displayName}
						/>
					</FormLabel>
					<HelperText>
						{$errors.displayName ? $errors.displayName[0] : ''}
					</HelperText>
				</div>
				<div>
					<FormLabel text="Email" constraint={$constraints.email}>
						<input
							class="input"
							class:input-error={$errors.email}
							type="text"
							name="email"
							bind:value={$form.email}
							disabled={$submitting}
							{...$constraints.email}
						/>
					</FormLabel>
					<HelperText>
						{$errors.email ? $errors.email[0] : ''}
					</HelperText>
				</div>

				{#if $page.params.id}
					<div>
						<FormLabel text="Full Name" constraint={$constraints.fullName}>
							<input
								class="input"
								class:input-error={$errors.fullName}
								type="text"
								name="fullName"
								bind:value={$form.fullName}
								disabled={$submitting}
								{...$constraints.fullName}
							/>
						</FormLabel>
						<HelperText>
							{$errors.fullName ? $errors.fullName[0] : ''}
						</HelperText>
					</div>
					<div>
						<FormLabel text="Role" constraint={$constraints.role}>
							<select class="select" name="role" bind:value={$form.role}>
								{#each userRoles as role}
									<option>{role}</option>
								{/each}
							</select>
						</FormLabel>
						<HelperText>
							{$errors.role ? $errors.role[0] : ''}
						</HelperText>
					</div>
					<div>
						<FormLabel text="New Password" constraint={$constraints.newPassword}>
							<input
								class="input"
								class:input-error={$errors.newPassword}
								type="password"
								name="newPassword"
								bind:value={$form.newPassword}
								disabled={$submitting}
								{...$constraints.newPassword}
							/>
						</FormLabel>
						<HelperText>
							{$errors.newPassword ? $errors.newPassword[0] : ''}
						</HelperText>
					</div>
				{/if}
			</div>
			<div class="mt-8 flex items-end gap-x-4">
				<div class="flex-1 sm:ml-auto sm:w-64 sm:flex-none">
					<FormLabel text="Enter your password to save" constraint={$constraints.password}>
						<input
							class="input"
							class:input-error={$errors.password}
							type="password"
							name="password"
							bind:value={$form.password}
							disabled={$submitting}
							{...$constraints.password}
						/>
					</FormLabel>
					<HelperText>
						{$errors.password ? $errors.password[0] : ''}
					</HelperText>
				</div>
				<div>
					<SubmitButton disabled={$submitting} />
				</div>
			</div>
		</div>
	</div>
</form>
