<script lang="ts">
	// import type { PageData } from './$types';
	import { mainStore } from '$stores';

	// export let data: PageData;
	// console.log(data);
</script>

{#if $mainStore.isLoggedIn}
	<p>id = {$mainStore.userProfile?.id}</p>
	<p>email = {$mainStore.userProfile?.email}</p>
	<p>active = {$mainStore.userProfile?.is_active}</p>
	<p>superuser = {$mainStore.userProfile?.is_superuser}</p>
{/if}
