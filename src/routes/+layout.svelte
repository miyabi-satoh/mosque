<script>
	import '../app.css';
</script>

<svelte:head>
	<title>MOSQUE</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<div class="container mx-auto max-w-3xl">
		<div class="navbar bg-base-100">
			<a href="/" class="btn btn-ghost text-xl normal-case">MOSQUE</a>
		</div>
	</div>
	<slot />
	<footer class="p-4 text-right text-sm text-base-content/50">
		Copyright &copy; 2023 miyabi-satoh.
	</footer>
</div>
