<script>
	import '../app.css';
</script>

<svelte:head>
	<title>MOSQUE</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<slot />
	<footer class="p-4 text-right text-sm text-base-content/50">
		Copyright &copy; 2023 miyabi-satoh.
	</footer>
</div>
