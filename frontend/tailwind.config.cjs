const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	corePlugins: {
		aspectRatio: false
	},

	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/line-clamp'),
		require('daisyui')
	]
};

module.exports = config;
