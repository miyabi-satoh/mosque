<script lang="ts">
	import { page } from '$app/stores';
	import { MainContainer } from '$lib';
</script>

<MainContainer>
	<h2 class="h2 m-4">{$page.status} {$page.error?.message}</h2>
</MainContainer>
