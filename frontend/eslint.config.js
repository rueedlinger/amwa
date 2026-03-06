import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  {
    // Files / ignore patterns
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Base JS rules
  js.configs.recommended,

  // Vue plugin recommended rules (flat)
  ...vue.configs['flat/recommended'],

  // Frontend JS + Vue files
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        __APP_VERSION__: 'readonly',
        __APP_NAME__: 'readonly',
      },
    },
  },

  // Node config files (tailwind.config.js, vite.config.js)
  {
    files: ['*.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Prettier integration
  {
    rules: {
      ...prettier.rules,
    },
  },
];
