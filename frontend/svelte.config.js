import path from 'path';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),
		alias: {
      // npm run check すること
			$lib: path.resolve('./src/lib'),
			$models: path.resolve('./src/models'),
			$stores: path.resolve('./src/stores')
		}
	}
};

export default config;
