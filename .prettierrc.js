import sapphirePrettierConfig from '@sapphire/prettier-config';

export default {
	...sapphirePrettierConfig,
	plugins: ['prettier-plugin-tailwindcss'],
	overrides: [
		{
			files: '*.svg',
			options: {
				parser: 'xml'
			}
		},
		{
			files: ['README.md', 'apps/**/*.md', 'packages/**/*.md'],
			options: {
				tabWidth: 2,
				useTabs: false,
				printWidth: 120,
				proseWrap: 'always'
			}
		}
	]
};
