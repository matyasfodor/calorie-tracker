module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript'],
  // overrides: [{
  //   "files": ["*.ts", "*.mts", "*.cts", "*.tsx"],
  //   "rules": {
  //     "@typescript-eslint/explicit-function-return-type": 0, //["error", { allowHigherOrderFunctions: true }]
  //   }
  // }
  // ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['react'],
  rules: {
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
  },
}
