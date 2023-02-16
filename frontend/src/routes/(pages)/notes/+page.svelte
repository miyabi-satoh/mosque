<script lang="ts">
	import { mainStore } from '$stores';
</script>

{#if $mainStore.isLoggedIn}
	<p>id = {$mainStore.userProfile?.id}</p>
	<p>email = {$mainStore.userProfile?.email}</p>
	<p>active = {$mainStore.userProfile?.is_active}</p>
	<p>superuser = {$mainStore.userProfile?.is_superuser}</p>
{/if}
