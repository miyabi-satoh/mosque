const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {}
	},

	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/line-clamp'),
		require('flowbite/plugin'),
		require('daisyui')
	],

	// darkMode: 'class',

	daisyui: {
		themes: ['fantasy', 'night']
	}
};

module.exports = config;
