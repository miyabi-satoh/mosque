<script lang="ts">
	import { Scrollable } from '$lib';
	import { URLS } from '$lib/consts';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="mx-4 mb-4 flex items-center">
	<a href={URLS.ADMIN_ACCOUNTS_CREATE} class="anchor flex-1">Create accounts from CSV data</a>
	<form method="post" action="{URLS.ADMIN_ACCOUNTS}/print" target="_blank">
		<button class="variant-ghost-primary btn">Print Selected Accounts</button>
	</form>
</div>
<Scrollable class="mx-4">
	<table class="w-full table-auto">
		<thead>
			<tr class="bg-surface-100-800-token sticky top-0">
				<th class="bg-surface-100-800-token sticky top-0 z-10 p-2">Login ID</th>
				<th class="bg-surface-100-800-token sticky top-0 z-10 p-2">Display Name</th>
				<th class="bg-surface-100-800-token sticky top-0 z-10 p-2">Full Name</th>
				<th class="bg-surface-100-800-token sticky top-0 z-10 p-2">Role</th>
			</tr>
		</thead>
		<tbody>
			{#each data.users as user}
				<tr class="odd:bg-surface-50-900-token even:bg-surface-200-700-token">
					<td class="p-2"
						><a class="anchor" href={`${URLS.PROFILE}/${user.id}`}>{user.username}</a></td
					>
					<td class="p-2">{user.displayName ?? ''}</td>
					<td class="p-2">{user.fullName ?? ''} </td>
					<td class="p-2">{user.role} </td>
				</tr>
			{/each}
		</tbody>
	</table>
</Scrollable>
