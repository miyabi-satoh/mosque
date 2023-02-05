<script>
	import { A, Heading, P } from 'flowbite-svelte';
	import { page } from '$app/stores';

	// console.log($page);
</script>

<div class="max-w-3xl 2xl:max-w-4xl mx-auto mt-8">
	<div class="container flex flex-wrap mx-auto pt-24">
		<Heading tag="h1">{$page.status} {$page.error?.message}</Heading>
		{#if $page.status == 404}
			<P class="w-full my-8">ご指定のページは見つかりませんでした</P>
			<P class="w-full">
				<A href={$page.url.href}>{$page.url.href}</A> は一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。
			</P>
		{/if}
	</div>
</div>
