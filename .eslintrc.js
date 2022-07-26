module.exports = {
  settings: { react: { version: 'detect' } },
  env: { browser: true, es6: true, node: true, mocha: true },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'standard'],
  globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly' },
  parser: '@babel/eslint-parser',
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 2018, sourceType: 'module' },
  plugins: ['react', 'react-hooks'],
  rules: {
    'no-multiple-empty-lines': 'off',
    'no-unused-vars': 'warn',
    'react/prop-types': 'off', // turn on for paranoid mode
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
}
