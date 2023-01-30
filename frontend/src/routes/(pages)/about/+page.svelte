<script lang="ts">
	import { page } from '$app/stores';
	import { P } from 'flowbite-svelte';
</script>

<P class="w-full">{$page?.data?.pageInfo?.content}</P>
