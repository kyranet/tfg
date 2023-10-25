import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('preline/plugin')],
	darkMode: 'class',
	content: ['node_modules/preline/dist/*.js'],
	theme: {
		extend: {
			colors: {
				'uned-green': '#01573c',
				'base-100': '#f1f3f5',
				'base-200': '#fbfcfc',
				'base-300': '#ffffff'
			}
		}
	}
};
