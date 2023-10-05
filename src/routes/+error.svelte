<script lang="ts">
	import { page } from '$app/stores';
</script>

<h2 class="h2 mx-4">{$page.status} {$page.error?.message}</h2>
