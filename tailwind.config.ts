/* eslint ts/no-unsafe-assignment: 'off', ts/no-var-requires: 'off', ts/no-require-imports: 'off' */
import { formatRgb, interpolate, rgb, wcagContrast } from 'culori';
import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
	// eslint-disable-next-line ts/no-require-imports
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('daisyui')],
	darkMode: 'class',
	daisyui: {
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes').light,
					primary: process.env.NUXT_BRANDING_COLOR_PRIMARY ?? '#01573c',
					'primary-content': makeContent(process.env.NUXT_BRANDING_COLOR_PRIMARY ?? '#01573c')
				}
			}
		]
	}
};

function makeContent(color: string) {
	const isDark = wcagContrast(color, 'black') < wcagContrast(color, 'white');
	const result = interpolate([color, isDark ? 'white' : 'black'], 'oklch')(0.9);
	return formatRgb(rgb(result));
}
