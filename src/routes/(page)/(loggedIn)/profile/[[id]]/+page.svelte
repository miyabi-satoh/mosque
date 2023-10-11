<script lang="ts">
	import { page } from '$app/stores';
	import { HelperText } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import {
		FileButton,
		getModalStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import CropModal from './CropModal.svelte';
	// import Cropper from 'svelte-easy-crop'

	const modalStore = getModalStore();

	export let data: PageData;
	const { form, message, errors, submitting, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;

	function onFileChange(event: Event): void {
		const inp = event.target as HTMLInputElement;
		if (inp.files) {
			console.log(`reader.onload`);
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
</script>

<form class="mx-4 space-y-4" method="post" enctype="multipart/form-data" use:enhance>
	{#if $message}
		<HelperText usePageStatus>{$message}</HelperText>
	{/if}
	<div class="flex flex-col sm:flex-row sm:gap-x-8">
		<div class="mx-auto w-32 space-y-2">
			<FileButton
				button="bg-surface-200-700-token border-surface-500-400-token w-full rounded-xl border-2 border-dotted"
				name="select-image"
				accept="image/*"
				multiple={false}
				on:change={onFileChange}
			>
				{#if $form.avatar}
					<img src={$form.avatar} class="w-full rounded-xl" alt="avatar" />
				{:else}
					<Icon icon="mdi:account" class="mx-auto" height="96" />
				{/if}
			</FileButton>

			<button
				class="variant-ghost-surface btn btn-sm w-full"
				disabled={!$form.avatar}
				on:click={() => ($form.avatar = null)}
			>
				Clear avatar
			</button>
			<input type="hidden" name="avatar" bind:value={$form.avatar} />
		</div>
		<div class="space-y-4 sm:flex-1">
			<div>
				<label class="label">
					<span>Login ID</span>
					<input
						class="input"
						class:input-error={$errors.username}
						type="text"
						id="username"
						name="username"
						bind:value={$form.username}
						disabled={$submitting}
						autocomplete="username"
					/>
				</label>
				<HelperText>
					{$errors.username ? $errors.username[0] : ''}
				</HelperText>
			</div>
			<div>
				<label class="label">
					<span>Display Name</span>
					<input
						class="input"
						class:input-error={$errors.displayName}
						type="text"
						id="displayName"
						name="displayName"
						bind:value={$form.displayName}
						disabled={$submitting}
					/>
				</label>
				<HelperText>
					{$errors.displayName ? $errors.displayName[0] : ''}
				</HelperText>
			</div>

			{#if $page.params.id}
				<div>
					<label class="label">
						<span>Full Name</span>
						<input
							class="input"
							class:input-error={$errors.fullName}
							type="text"
							id="fullName"
							name="fullName"
							bind:value={$form.fullName}
							disabled={$submitting}
						/>
					</label>
					<HelperText>
						{$errors.fullName ? $errors.fullName[0] : ''}
					</HelperText>
				</div>
				<div>
					<label class="label">
						<span>Role</span>
						<select class="select" name="role" bind:value={$form.role}>
							{#each data.userRoles as role}
								<option>{role}</option>
							{/each}
						</select>
					</label>
					<HelperText>
						{$errors.role ? $errors.role[0] : ''}
					</HelperText>
				</div>
				<div>
					<label class="label">
						<span>New Password</span>
						<input
							class="input"
							class:input-error={$errors.newPassword}
							type="password"
							id="newPassword"
							name="newPassword"
							bind:value={$form.newPassword}
							disabled={$submitting}
						/>
					</label>
					<HelperText>
						{$errors.newPassword ? $errors.newPassword[0] : ''}
					</HelperText>
				</div>
			{/if}

			<div>
				<label class="label">
					<span>Enter your password to save</span>
					<input
						class="input"
						class:input-error={$errors.password}
						type="password"
						id="password"
						name="password"
						bind:value={$form.password}
						disabled={$submitting}
					/>
				</label>
				<HelperText>
					{$errors.password ? $errors.password[0] : ''}
				</HelperText>
			</div>
		</div>
	</div>
	<div class="text-right">
		<button class="variant-ghost-primary btn">Save</button>
	</div>
</form>
