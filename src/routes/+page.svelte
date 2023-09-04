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
	<h1 class="p-4 text-4xl font-semibold">MOSQUE</h1>

	<div class="p-4 grid grid-cols-1 gap-4">
		{#each menus as menu}
			<a href={menu.url}>
				<div
					class="w-full border-2 border-base-content/25 rounded-lg bg-neutral/25 hover:bg-neutral/75"
				>
					<div class="flex items-center text-accent">
						<h2 class="flex-1 text-2xl font-semibold pl-4">{menu.name}</h2>
						<Icon icon="mdi:chevron-right" height="64px" />
					</div>
				</div>
			</a>
		{/each}
	</div>
</main>
