// @ts-check

import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    rules: {
      'no-var': 'error',
      semi: 'error',
      eqeqeq: 'error',
      'comma-spacing': 'error',
      indent: ['error', 2],
      'block-spacing': 'error',
      'object-curly-spacing': ['error', 'always'],
      'space-infix-ops': 'error',
      'arrow-spacing': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'max-len': [
        'error',
        { code: 80, ignoreUrls: true, ignorePattern: '^imports.+sfroms.+;$' },
      ],
    },
  },
  eslintConfigPrettier,
);
