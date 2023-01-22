<script lang="ts">
	import { Heading, P, A } from 'flowbite-svelte';
  import { onMount } from 'svelte';

  let data: {message: string};
  onMount(async () => {
    const res = await fetch(`/api/v1/tests/`)
    data = await res.json()
    console.log(data)
  })
</script>

<P>{data?.message}</P>
