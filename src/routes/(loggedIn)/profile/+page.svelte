<script lang="ts">
	import { MainContainer } from '$lib';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MainContainer>
	<div>Profile</div>
	<div>{data.user?.username}</div>
</MainContainer>
