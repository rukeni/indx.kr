import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import sonarjs from 'eslint-plugin-sonarjs';
import pluginReact from 'eslint-plugin-react';
import tsParser from '@typescript-eslint/parser';
import pluginPrettier from 'eslint-plugin-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import microsoftSdl from '@microsoft/eslint-plugin-sdl';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: [
      'src/**/*.{js,mjs,cjs,ts,jsx,tsx}',
      'app/**/*.{js,mjs,cjs,ts,jsx,tsx}',
      'components/**/*.{js,mjs,cjs,ts,jsx,tsx}',
    ],
    ignores: [
      '**/node_modules/**',
      '**/*.d.ts',
      '**/.vite/**',
      '**/out/**',
      '**/test-results/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/public/**',
      '**/.git/**',
    ],
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      noInlineConfig: false,
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'writable',
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{jsx,tsx}'],
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },
  {
    plugins: {
      perfectionist,
      '@microsoft/sdl': microsoftSdl,
      sonarjs,
      prettier: pluginPrettier,
    },
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'line-length',
          order: 'asc',
          groups: [
            'type',
            'builtin-type',
            'external-type',
            'internal-type',
            'parent-type',
            'sibling-type',
            'index-type',
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'style',
          ],
          newlinesBetween: 'always',
          customGroups: {
            type: {
              react: ['^react$', '^react-.+', '^@react'],
              next: ['^next', '^@next'],
            },
            value: {
              react: ['^react$', '^react-.+', '^@react'],
              next: ['^next', '^@next'],
            },
          },
          internalPattern: ['^@/.*', '^@internal/.*'],
          sortSideEffects: true,
        },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'separate-type-imports',
        },
      ],

      'no-unused-vars': 'off',

      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          parser: 'typescript',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'no-console': 'warn',

      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'always', prev: ['case', 'default'], next: '*' },
      ],
      complexity: ['warn', 10],
      'sonarjs/cognitive-complexity': ['warn', 10],
      'lines-between-class-members': ['error', 'always'],
      'space-before-blocks': 'error',
      'spaced-comment': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
    },
  },
];
