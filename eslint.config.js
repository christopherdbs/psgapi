import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';

export default [
  { languageOptions: { globals: globals.browser } },
  pluginReactConfig,
  js.configs.recommended,
  {
    extends: ['prettier'],
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
  eslintConfigPrettier,
];
