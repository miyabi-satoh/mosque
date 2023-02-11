import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import path from 'path';

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
			$schemas: path.resolve('./src/schemas'),
			$stores: path.resolve('./src/stores')
		},
		env: {
			dir: '..'
		}
	}
};

export default config;
