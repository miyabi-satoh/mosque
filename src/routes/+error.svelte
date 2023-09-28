<script lang="ts">
	import { page } from '$app/stores';
	import { MainContainer } from '$lib';
</script>

<MainContainer>
	<h1 class="h1 m-4">{$page.status} {$page.error?.message}</h1>
</MainContainer>
