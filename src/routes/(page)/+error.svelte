<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1 class="h1 mx-4">{$page.status} {$page.error?.message}</h1>
