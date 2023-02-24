<script lang="ts" context="module">
	type AlertType = 'info' | 'warning' | 'success' | 'error';
	type ToastType = {
		message: string;
		alertType: AlertType;
	};

	let queue: ToastType[] = [];

	export const addToast = (message: string, alertType: AlertType) => {
		const toast = {
			message,
			alertType
		};
		queue = [...queue, toast];
		// setTimeout(() => {
		// 	queue = queue.slice(1);
		// }, 5000);
		console.log(queue);
	};
</script>

<script lang="ts">
	export let position = 'toast-top toast-center';
</script>

<div class="toast z-50 {position}">
	{#each queue as item}
		<div class="alert {item.alertType}">
			<div>
				<span>{item.message}</span>
			</div>
		</div>
	{/each}
</div>
