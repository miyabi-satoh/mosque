import { skeleton } from '@skeletonlabs/tw-plugin';
import forms from '@tailwindcss/forms';
import { join } from 'node:path';
import type { Config } from 'tailwindcss';

const config = {
	// darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		fontFamily: {
			sans: '"Helvetica Neue", "Helvetica", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Arial", "Yu Gothic", "Meiryo", sans-serif',
			serif:
				'"Times New Roman", "YuMincho", "Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif'
		},
		extend: {}
	},
	plugins: [
		forms,
		// require('daisyui')
		skeleton({
			themes: { preset: ['skeleton'] }
		})
	]
	// daisyui: {
	// 	logs: false
	// }
} satisfies Config;

export default config;
