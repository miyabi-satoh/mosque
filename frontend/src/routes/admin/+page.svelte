<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { userStore } from '$lib/user';

	$: if (!$userStore || $userStore.id != 1) {
		error(404, 'Not Found');
	}
</script>

<div>admin page</div>
