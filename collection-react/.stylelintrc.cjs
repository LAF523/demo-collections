module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-rational-order', 'stylelint-config-prettier'],
  customSyntax: 'postcss-less',
  rules: {
    // 不允许使用位置函数，除ignoreFunctions数组下的元素
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: [
          'fade',
          'fadeout',
          'tint',
          'darken',
          'ceil',
          'fadein',
          'floor',
          'unit',
          'shade',
          'lighten',
          'percentage',
          '-',
          '~`colorPalette'
        ]
      }
    ],
    'no-descending-specificity': true, // 允许低优先级的选择器出现在高优先级的选择器之后。
    'number-max-precision': 8, // 限制小数个数
    'color-function-notation': 'legacy', // 设置颜色rgb等的写法，逗号相隔，a { color: rgba(12, 122, 231, 0.2) }
    'color-hex-case': 'lower', // 16进制颜色小写
    'string-quotes': 'single', // 单引号
    'number-leading-zero': 'never' // 小数不带0
  },

  // 忽略以下文件的检查
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts', '**/*.json', '**/*.md']
};
