<script lang="ts">
	import { fields } from '$lib/fields';
	import { enhance } from '$app/forms';
	import type { ResourceUpdate } from '$lib/resource';
	import type { PostErros } from '$lib/types';
	import { URL_ADMIN_RESOURCES } from '$lib/constants';
	import type { Asset } from '@prisma/client';
	import InputText from '../molecules/InputText.svelte';
	import Textarea from '../molecules/Textarea.svelte';
	import IconLinkButton from '../molecules/IconLinkButton.svelte';
	import IconButton from '../molecules/IconButton.svelte';
	import Search from '../atoms/Search.svelte';

	type Schema = ResourceUpdate;
	export let data: Schema | undefined;
	export let errors: PostErros<Schema> | undefined;
	let searchValue: string;
	let assets: Asset[] = [];

	$: searchReaction(searchValue);
	const searchReaction = (_s: string) => {
		console.log(`search reaction`);
	};
</script>

<form
	method="post"
	use:enhance={() => {
		return async ({ update }) => {
			await update({ reset: false });
		};
	}}
>
	<div class="grid gap-4 grid-cols-2">
		<div class="col-span-2 sm:col-span-1">
			<InputText
				name={fields.resource.title.name}
				value={data?.title}
				required
				errorMessage={errors?.title}>{fields.resource.title.label}</InputText
			>
		</div>
		<div class="col-span-2 sm:col-span-1">
			<Textarea
				name={fields.resource.description.name}
				value={data?.description}
				errorMessage={errors?.description}
				>{fields.resource.description.label}
			</Textarea>
		</div>
		<div>
			<label for="" class="label label-text">添付ファイル</label>
			<div class="flex flex-col gap-2">
				<Search bind:value={searchValue} />
				<select class="select select-bordered w-full">
					<option disabled selected>添付ファイルを追加</option>
					{#each assets as asset}
						<option value={asset}>{asset.title}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
	<div class="my-4 flex justify-between">
		<IconLinkButton class="" icon="mdi:arrow-left" href={URL_ADMIN_RESOURCES}>戻る</IconLinkButton>
		<IconButton icon="mdi:check">保存</IconButton>
	</div>
</form>
