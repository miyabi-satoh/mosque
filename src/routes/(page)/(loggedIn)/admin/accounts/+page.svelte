<script lang="ts">
	import { scrollable } from '$lib/actions/scrollable';
	import HelperText from '$lib/components/HelperText.svelte';
	import { URLS, userRoles } from '$lib/consts';
	import { formatDate } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { LinkButton } from '$lib';

	export let data: PageData;
	let allChecked: boolean = false;

	const { form, message, enhance } = superForm(data.form);

	$: updateChecked(allChecked);
	function updateChecked(checked: boolean): void {
		$form.checked = checked ? data.users.map((u) => u.id) : [];
	}

	const thClasses = 'bg-surface-100-800-token sticky top-0 z-10 p-2';
</script>

{#if $message}
	<div class="mx-4 mb-2">
		<HelperText usePageStatus>{$message}</HelperText>
	</div>
{/if}
<div class="mx-4 mb-2 flex flex-wrap items-center gap-2">
	<LinkButton href={URLS.ADMIN_ACCOUNTS_CREATE} class="flex-none">
		<span><Icon icon="mdi:account-multiple-plus" height="auto" /></span>
		<span class="hidden sm:inline">Bulk create</span>
	</LinkButton>

	<form method="post" action={URLS.ADMIN_ACCOUNTS_PRINT} target="_blank">
		<input type="hidden" name="checked" value={$form.checked} />
		<button
			class="variant-filled-error btn"
			disabled={$form.checked.length === 0}
			on:click={(e) => !confirm('Are you sure you want to reset passwords?') && e.preventDefault()}
		>
			<span><Icon icon="mdi:lock-reset" height="auto" /></span>
			<span class="hidden sm:inline">Reset passwords</span>
		</button>
	</form>

	<div class="flex-1"></div>

	<form method="post" use:enhance>
		<input type="hidden" name="checked" value={$form.checked} />
		<div class="flex items-center gap-x-2">
			<span class="hidden flex-none sm:inline">Change role to </span>
			<select class="select w-auto" name="role">
				{#each userRoles as role}
					<option>{role}</option>
				{/each}
			</select>
			<button class="variant-soft-primary btn" disabled={$form.checked.length === 0}>
				<span><Icon icon="mdi:check" height="auto" /></span>
				<span class="hidden sm:inline">Change</span>
			</button>
		</div>
	</form>
</div>
<div class="flex-1 pl-4 pr-2" use:scrollable>
	<table class="w-full table-auto">
		<thead>
			<tr class="bg-surface-100-800-token sticky top-0">
				<th class={thClasses}>
					<input type="checkbox" class="checkbox" name="allCheck" bind:checked={allChecked} />
				</th>
				<th class={thClasses}>ID</th>
				<th class={thClasses}>Display</th>
				<th class={thClasses}>Full</th>
				<th class={thClasses}>Role</th>
				<th class="{thClasses} hidden md:table-cell">Last</th>
			</tr>
		</thead>
		<tbody>
			{#each data.users as user}
				<tr class="odd:bg-surface-50-900-token even:bg-surface-200-700-token">
					<td class="p-2 text-center">
						<input
							type="checkbox"
							class="entry checkbox px-2"
							bind:group={$form.checked}
							name="checked"
							value={user.id}
						/>
					</td>
					<td class="whitespace-nowrap p-2 text-center">
						<a class="anchor" href={URLS.PROFILE(user.id)}>{user.username}</a>
					</td>
					<td class="whitespace-nowrap p-2 text-center">{user.displayName ?? ''}</td>
					<td class="whitespace-nowrap p-2 text-center">{user.fullName ?? ''} </td>
					<td class="whitespace-nowrap p-2 text-center">{user.role} </td>
					<td class="hidden whitespace-nowrap p-2 text-center md:table-cell">
						{user.lastLoginAt ? formatDate(user.lastLoginAt) : ''}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
