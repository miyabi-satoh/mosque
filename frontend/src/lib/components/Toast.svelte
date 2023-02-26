<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	type AlertType = 'alert-info' | 'alert-warning' | 'alert-success' | 'alert-error';
	type ToastType = {
		id: number;
		message: string;
		alertType: AlertType;
	};

	export const toastQueue = writable<ToastType[]>([]);

	export const addToast = (message: string, alertType: AlertType = 'alert-success') => {
		if (message) {
			const toast = {
				id: new Date().getTime(),
				message,
				alertType
			};
			toastQueue.update((queue) => [...queue, toast]);
			setTimeout(() => {
				toastQueue.update((queue) => {
					// 単純にsliceするとトランジションが発生しない
					// return value.slice(1);
					// 一度メッセージをクリアして、２回目のタイムアウトで配列から除去する
					const validQueue = queue.filter((t) => t.message);
					validQueue[0].message = '';
					return validQueue;
				});
			}, 4000);
		}
	};
</script>

<script lang="ts">
	export let position = 'toast-top toast-center';
</script>

<div class="toast z-50 w-full {position}">
	{#each $toastQueue as item (item.id)}
		{#if item.message}
			<div class="alert {item.alertType}" transition:fade|local>
				<div>
					<span>{item.message}</span>
				</div>
			</div>
		{/if}
	{/each}
</div>
