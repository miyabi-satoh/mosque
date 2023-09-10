<script>
	import Icon from '@iconify/svelte';

	const menus = [
		{
			name: 'Ｃテスト音声配信サービス',
			url: '/ctest'
		},
		{
			name: '英検過去問配信サービス',
			url: '/eiken'
		}
	];
</script>

<main class="container mx-auto max-w-3xl flex-1">
	<div class="grid grid-cols-1 gap-4 p-4">
		{#each menus as menu}
			<a href={menu.url}>
				<div
					class="w-full rounded-lg border-2 border-base-content/25 bg-base-300/50 hover:bg-base-300/5"
				>
					<div class="flex items-center text-accent">
						<h2 class="flex-1 pl-4 text-2xl font-semibold">{menu.name}</h2>
						<Icon icon="mdi:chevron-right" height="64px" />
					</div>
				</div>
			</a>
		{/each}
	</div>
</main>
