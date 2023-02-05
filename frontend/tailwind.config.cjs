const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {}
	},

	plugins: [require('@tailwindcss/line-clamp'), require('flowbite/plugin')],
	darkMode: 'class'
};

module.exports = config;
