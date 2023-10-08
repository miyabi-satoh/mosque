<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	{@html data.svg}
</div>

<style lang="scss">
	@page {
		size: A4 portrait;
		margin: 0; // ヘッダー・フッターが出力されないように
	}

	:global(*) {
		margin: 0;
		padding: 0;
		user-select: none;
	}

	:global(body) {
		width: 210mm;
		// color-adjust: exact;
		> :global(svg) {
			width: 210mm;
			height: 295.5mm; // 297mmだと2ページ目にはみ出してしまうので微調整
			page-break-after: always;
		}
	}

	// プレビュー用
	@media screen {
		:global(body) {
			background: #ccc;
			margin: 0 auto;
			> :global(svg) {
				background: #fff;
				box-shadow: 0 0.5mm 2mm rgba(0, 0, 0, 0.3);
				margin-top: 5mm;
			}
		}
	}
</style>
