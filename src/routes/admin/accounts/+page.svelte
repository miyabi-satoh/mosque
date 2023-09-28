<script lang="ts">
	import { MainContainer } from '$lib';
	import { URLS } from '$lib/consts';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MainContainer innerScroll>
	<div class="p-4">
		<a href={URLS.ADMIN_ACCOUNTS_CREATE} class="anchor">Create accounts from CSV data</a>
	</div>
	<div class="mx-4 flex-1 overflow-y-scroll">
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
	</div>
</MainContainer>
