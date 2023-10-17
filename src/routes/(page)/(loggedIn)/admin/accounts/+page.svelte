<script lang="ts">
	import { Scrollable } from '$lib';
	import { URLS, userRoles } from '$lib/consts';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { formatRelative } from 'date-fns';
	import { ja } from 'date-fns/locale';
	import HelperText from '$lib/components/HelperText.svelte';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	let allChecked: boolean = false;

	const { form, message, enhance } = superForm(data.form, {
		taintedMessage: null,
		resetForm: true
	});

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
	<a href={URLS.ADMIN_ACCOUNTS_CREATE} class="variant-filled btn flex-none">
		<span><Icon icon="mdi:account-multiple-plus" height="auto" /></span>
		<span class="hidden sm:inline">Bulk create</span>
	</a>

	<form method="POST" action={URLS.ADMIN_ACCOUNTS_PRINT} target="_blank">
		<input type="hidden" name="checked" value={$form.checked} />
		<button class="variant-filled btn" disabled={$form.checked.length === 0}>
			<span><Icon icon="mdi:printer" height="auto" /></span>
			<span class="hidden sm:inline">Print Selected Accounts</span>
		</button>
	</form>

	<div class="flex items-center gap-x-2">
		<span class="flex-none">Change role to </span>
		<form method="post" action={URLS.ADMIN_ACCOUNTS} use:enhance>
			<input type="hidden" name="checked" value={$form.checked} />
			<select class="select w-auto" name="role">
				{#each userRoles as role}
					<option>{role}</option>
				{/each}
			</select>
			<button class="variant-filled btn" disabled={$form.checked.length === 0}>Change</button>
		</form>
	</div>
</div>
<Scrollable class="ml-4 mr-2 overflow-x-scroll">
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
					<td class="whitespace-nowrap p-2">
						<a class="anchor" href={`${URLS.PROFILE}/${user.id}`}>{user.username}</a>
					</td>
					<td class="whitespace-nowrap p-2">{user.displayName ?? ''}</td>
					<td class="whitespace-nowrap p-2">{user.fullName ?? ''} </td>
					<td class="whitespace-nowrap p-2">{user.role} </td>
					<td class="hidden whitespace-nowrap p-2 md:table-cell">
						{user.lastLoginAt ? formatRelative(user.lastLoginAt, new Date(), { locale: ja }) : ''}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</Scrollable>
