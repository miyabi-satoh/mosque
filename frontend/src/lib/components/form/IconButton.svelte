<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	let className = 'btn-primary';
	export { className as class };
	export let icon: string;
	export let iconHeight = 20;
	let labelFor: string | undefined = undefined;
	export { labelFor as for };

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		if (labelFor) {
			window.document.getElementById(labelFor)?.click();
		}
		dispatch('click');
	};
</script>

<button class="btn gap-2 {className}" on:click={handleClick}>
	<Icon {icon} height={iconHeight} />
	<span><slot /></span>
</button>
