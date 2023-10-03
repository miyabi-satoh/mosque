<script lang="ts">
	import { page } from '$app/stores';
	import { MainContainer } from '$lib';
	import HelperText from '$lib/components/HelperText.svelte';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, message, errors, submitting, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;
</script>

<MainContainer>
	<form class="p-4" method="post" use:enhance>
		<HelperText class="my-2" usePageStatus>
			{$message ?? ''}
		</HelperText>
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
		<div class="my-6 flex justify-end">
			<button class="variant-ghost-primary btn">Save</button>
		</div>
	</form>
</MainContainer>
