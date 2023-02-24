<script lang="ts" context="module">
	import { writable } from 'svelte/store';

	type AlertType = 'alert-info' | 'alert-warning' | 'alert-success' | 'alert-error';
	type ToastType = {
		message: string;
		alertType: AlertType;
	};

	export const toastQueue = writable<ToastType[]>([]);

	export const addToast = (message: string, alertType: AlertType = 'alert-success') => {
		if (message) {
			const toast = {
				message,
				alertType
			};
			toastQueue.update((value) => [...value, toast]);
			setTimeout(() => {
				toastQueue.update((value) => value.slice(1));
			}, 2000 + Math.floor(message.length * 20));
		}
	};
</script>

<script lang="ts">
	export let position = 'toast-top toast-center';
</script>

<div class="toast z-50 min-w-[50%] max-w-[80%] {position}">
	{#each $toastQueue as item}
		<div class="alert {item.alertType}">
			<div>
				<span>{item.message}</span>
			</div>
		</div>
	{/each}
</div>
