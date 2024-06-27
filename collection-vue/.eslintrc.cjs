module.exports = {
  root: true, // 指定项目根目录位置,整个项目的eslint规则都限制在这个文件夹内
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended', // ts规则
    'plugin:vue/vue3-recommended', // 使用插件支持vue3
    'airbnb-base', // 基础js规则
    'plugin:prettier/recommended', // prettier和eslint的冲突
    './.eslintrc-auto-import.json'
  ],
  overrides: [
    {
      env: {
        node: true // node环境下运行eslint
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],

  // 解析器
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'no-unused-vars': 'error',
    'no-debugger': 2,
    'no-console': 2,
    'no-alert': 2,
    'no-dupe-keys': 2,
    'no-dupe-args': 2,
    'no-use-before-define': [2, { functions: false }],
    '@typescript-eslint/no-explicit-any': ['off'],
    'react/prop-types': 'off', // 使用ts的参数类型检查
    'import/extensions': 'off',
    'prefer-template': 'off',
    'no-var': 'error', // 要求使用 let 或 const 而不是 var
    'no-multiple-empty-lines': ['error', { max: 3 }], // 不允许多个空行
    'prefer-const': 'off', // 使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
    'no-irregular-whitespace': 'off', // 禁止不规则的空白\
    'import/no-cycle': 0,
    'no-nested-ternary': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'prefer-destructuring': 0,
    'no-shadow': 0,
    'no-param-reassign': 0,
    'consistent-return': 0,
    'no-case-declarations': 0,
    'prefer-promise-reject-errors': 0,
    camelcase: 0,
    'import/no-extraneous-dependencies': 0,
    'no-underscore-dangle': 0,
    'no-promise-executor-return': 0, // vue (https://eslint.vuejs.org/rules)
    'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效。
    'vue/v-slot-style': 'error', // 强制执行 v-slot 指令样式
    'vue/no-mutating-props': 'off', // 不允许组件 prop的改变
    'vue/no-v-html': 'off', // 禁止使用 v-html
    'vue/custom-event-name-casing': 'off', // 为自定义事件名称强制使用特定大小写
    'vue/attributes-order': 'off', // vue api使用顺序，强制执行属性顺序
    'vue/one-component-per-file': 'off', // 强制每个组件都应该在自己的文件中
    'vue/html-closing-bracket-newline': 'off', // 在标签的右括号之前要求或禁止换行
    'vue/max-attributes-per-line': 'off', // 强制每行的最大属性数
    'vue/multiline-html-element-content-newline': 'off', // 在多行元素的内容之前和之后需要换行符
    'vue/singleline-html-element-content-newline': 'off', // 在单行元素的内容之前和之后需要换行符
    'vue/attribute-hyphenation': 'off', // 对模板中的自定义组件强制执行属性命名样式
    'vue/require-default-prop': 'off', // 此规则要求为每个 prop 为必填时，必须提供默认值
    'vue/multi-word-component-names': 'off' // 要求组件名称始终为 “-” 链接的单词
  }
};
