<script lang="ts">
	import { MainContainer } from '$lib';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MainContainer>
	<div class="p-4">
		{#each data.users as user}
			<div>
				<span>{user.username}</span>
			</div>
		{/each}
	</div>
</MainContainer>
