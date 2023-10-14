<script lang="ts">
	import { Scrollable, parentClass } from '$lib';
	import { URLS } from '$lib/consts';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { formatRelative } from 'date-fns';
	import { ja } from 'date-fns/locale';

	export let data: PageData;
	let allChecked: boolean = false;

	const { form } = superForm(data.form);

	$: updateChecked(allChecked);
	function updateChecked(checked: boolean): void {
		$form.checked = checked ? data.users.map((u) => u.id) : [];
	}

	const thClasses = 'bg-surface-100-800-token sticky top-0 z-10 p-2';
</script>

<form class={parentClass} method="POST" action={URLS.ADMIN_ACCOUNTS_PRINT} target="_blank">
	<div class="mx-4 mb-4 flex items-center">
		<a href={URLS.ADMIN_ACCOUNTS_CREATE} class="anchor flex-1">Create accounts from CSV data</a>
		<button type="submit" class="variant-ghost-primary btn" disabled={$form.checked.length === 0}
			>Print Selected Accounts</button
		>
	</div>
	<Scrollable class="mx-4">
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
						<td class="p-2"
							><a class="anchor" href={`${URLS.PROFILE}/${user.id}`}>{user.username}</a></td
						>
						<td class="p-2">{user.displayName ?? ''}</td>
						<td class="p-2">{user.fullName ?? ''} </td>
						<td class="p-2">{user.role} </td>
						<td class="hidden p-2 md:table-cell">
							{user.lastLoginAt ? formatRelative(user.lastLoginAt, new Date(), { locale: ja }) : ''}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Scrollable>
</form>
