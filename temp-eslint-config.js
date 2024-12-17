import babelParser from '@babel/eslint-parser'
import reactPlugin from 'eslint-plugin-react'

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      sourceType: 'module',
      ecmaVersion: 2021,
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      'semi': [2, 'never'],
    },
  },
]