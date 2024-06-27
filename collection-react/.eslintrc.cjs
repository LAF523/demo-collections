module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:react/jsx-runtime'
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Apply rules only to TypeScript files
      rules: {
        'no-unused-vars': 'off' // Disable 'no-unused-vars' rule for TypeScript files
      }
    },
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'no-unused-vars': 'error',
    'no-debugger': 2,
    'no-alert': 2,
    'no-dupe-keys': 2,
    'no-dupe-args': 2,
    'no-use-before-define': [2, { functions: false }],
    '@typescript-eslint/no-explicit-any': ['off'],
    'react/prop-types': 'off' // 使用ts的参数类型检查
  }
};
