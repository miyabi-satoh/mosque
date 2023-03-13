<script lang="ts">
	import { URL_ADMIN_DBMAINTE, URL_ADMIN_RESOURCES, URL_ADMIN_USERS } from '$lib/constants';
	import Icon from '@iconify/svelte';
	console.log(`/routes/(pages)/admin/+page.svelte`);
	const menuItems = [
		{
			label: 'ユーザー管理',
			url: URL_ADMIN_USERS,
			icon: 'mdi:user-multiple'
		},
		{
			label: 'リソース管理',
			url: URL_ADMIN_RESOURCES,
			icon: 'mdi:file-document-multiple'
		},
		{
			label: 'DBメンテ',
			url: URL_ADMIN_DBMAINTE,
			icon: 'mdi:database'
		}
	] as const;
</script>

<h2>メニュー</h2>
<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 not-prose">
	{#each menuItems as menuItem (menuItem.url)}
		<a
			class="card card-compact border-2 border-base-200 bg-base-300/25 hover:bg-gray-300/10 transition-all duration-200 hover:shadow hover:-translate-y-1"
			href={menuItem.url}
		>
			<div class="card-body">
				<div class="flex items-start justify-between">
					<h3 class="card-title">
						{menuItem.label}
					</h3>
					<Icon icon={menuItem.icon} height="64" />
				</div>
			</div>
		</a>
	{/each}
</div>
