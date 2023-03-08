module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['svelte3', '@typescript-eslint', 'prettier'],
  ignorePatterns: ['*.cjs'],
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  settings: {
    'svelte3/typescript': () => require('typescript'),
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    'prettier/prettier': ['error'],
    'comma-dangle': [
      'error',
      {
        functions: 'never',
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
      },
    ],
    'func-style': [
      'error',
      'expression',
      {
        allowArrowFunctions: true,
      },
    ],
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          arguments: false,
          attributes: false,
        },
      },
    ],
    'spaced-comment': 'error',
  },
};
