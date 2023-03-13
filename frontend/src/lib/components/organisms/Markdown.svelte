<script lang="ts">
	import { marked } from 'marked';

	export let divClass = '';
	export let source: string;

	marked.setOptions({
		pedantic: false, // trueの場合はmarkdown.plに準拠する gfmを使用する場合はfalseで大丈夫
		gfm: true, // GitHub Flavored Markdownを使用
		breaks: true, // falseにすると改行入力は末尾の半角スペース2つになる
		silent: false // trueにするとパースに失敗してもExceptionを投げなくなる
	});
</script>

<div class={divClass}>
	{@html marked.parse(source)}
</div>
