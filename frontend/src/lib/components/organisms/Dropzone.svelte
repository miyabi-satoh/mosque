<script lang="ts">
	import Icon from '@iconify/svelte';

	export let id: string;
	export let name: string;
	export let accept: string | undefined = undefined;
	export let files: FileList | undefined;
</script>

<label
	for={id}
	class="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer"
>
	<div class="flex flex-col items-center justify-center p-6">
		<Icon icon="mdi:cloud-upload-outline" height="auto" />
		<p class="text-sm">
			ここにファイルをドロップするか、クリックしてファイルを選択。
			{#if $$slots.default}
				<br />
				<slot />
			{/if}
		</p>
	</div>
	<input {id} {name} type="file" class="hidden" bind:files {accept} />
</label>
