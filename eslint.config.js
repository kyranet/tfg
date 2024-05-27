import antfu from '@antfu/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default antfu(
	{
		stylistic: false,
		rules: {
			'no-console': 'warn',
			'no-void': 'off', // FP
			'sort-imports': 'off',
			'node/prefer-global/process': 'off',
			'ts/no-throw-literal': 'off',
			'ts/no-unsafe-member-access': 'off', // FP
			'ts/no-unnecessary-type-assertion': 'off', // FP
			'ts/no-namespace': 'off',
			'ts/no-floating-promises': 'off', // FP with knex thenables
			'ts/no-unsafe-return': 'off', // FP
			'ts/unbound-method': 'off', // FP
			'vue/block-order': ['error', { order: ['template', 'script', 'style'] }]
		},
		vue: true,
		typescript: {
			tsconfigPath: 'tsconfig.json'
		},
		jsonc: false,
		yaml: false
	},
	eslintConfigPrettier
);
