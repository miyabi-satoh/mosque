<script lang="ts">
	import { MainContainer } from '$lib';
	import { URLS } from '$lib/consts';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MainContainer innerScroll>
	<div class="p-4">
		<a href={URLS.ADMIN_USER_CREATE} class="anchor">Create accounts from CSV data</a>
	</div>
	<div class="flex-1 overflow-y-scroll p-4">
		{#each data.users as user}
			<div>
				<span>{user.username}</span>
			</div>
		{/each}
	</div>
</MainContainer>
