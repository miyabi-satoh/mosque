<script>
	import '../app.css';
</script>

<svelte:head>
	<title>MOSQUE</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<slot />
	<footer class="text-sm text-base-content/50 text-right p-4">
		Copyright &copy; 2023 miyabi-satoh.
	</footer>
</div>
