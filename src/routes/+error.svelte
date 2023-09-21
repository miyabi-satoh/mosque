<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="container mx-auto flex-1 lg:max-w-3xl">
	<h1 class="p-4 text-4xl font-semibold">{$page.status} {$page.error?.message}</h1>
</main>
