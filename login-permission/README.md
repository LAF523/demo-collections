## 模板简介

> 强规范的函数式编程项目模板 推荐node环境20.x

基础配置:

- .vscode

- react@18.x

- react-router-dom@6.x

- vite@5.x

- antd@5.x

- axios@1.x + 封装

  > 最终调用方式: const [data,err] = await getUserInfo()

规范配置:

- EditorConfig

- eslint

- prettier

- husky

- lint-staged

- commitlint + 交互式提交

## 搭建步骤

### 基础初始化

```js
npm create vite@latest -- --template react-ts

npm i
```

根目录新建env

```js
|--env
  |--.env # 放置公用配置
  |--.env.local # 放置敏感配置
  |--.env.development # 放置开发环境配置
  |--.env.production # 放置生产环境配置

vite.config.js配置env路径:
npm i --save-dev @types/node 先安装一下,否则无法解析path

import path from 'path'
const envDir = path.resolve(process.cwd(), './env')
const config = defineConfig({
    // ...
    envDir,
    envPrefix: 'MFE_',
})
```

配置别名

```js
const config = defineConfig({
  // ...
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.scss', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src'), // 源文件根目录
      '@tests': path.resolve(__dirname, 'tests'), // 测试文件根目录
      '@config': path.resolve(__dirname, 'config') // 配置文件根目录
    }
  }
});
```

在tsconfig文件中也要添加:

```js
"compilerOptions": {
    // 使用别名时避免ts语法检查找不到类型声明
    "paths": {
      "@/*": ["./src/*"]
    }
},
```

配置dev server

```js
const config = defineConfig({
  server: {
    open: true, // 自动打开浏览器
    port: 3002, // 服务端口
    proxy: {
      '/api': '', // api代理路径
      '/mock': '' // mock代理路径
    }
  }
});
```

### EditorConfig

安装vscode插件 EditorConfig for VS Code

根目录下创建.editorconfig文件,统一编辑器行为

```js
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
# 表示是最顶层的配置文件，设为 true 时，停止向上查找
root = true

# Unix-style newlines with a newline ending every file
[*]

# 通用配置 -----------

# 缩进方式
indent_style = space
# 设置换行符，值为 lf(换行)、cr(回车) 和 crlf(回车换行)
end_of_line = lf
# 编码格式
charset = utf-8
# 是否删除行尾空格
trim_trailing_whitespace = true
# 缩进大小
indent_size = 4

# 匹配文件配置 -----------

# Matches multiple files with brace expansion notation
# Set default charset
[*.{js,py}]
charset = utf-8

# 4 space indentation
[*.py]
indent_style = space
indent_size = 4

# Tab indentation (no size specified)
[Makefile]
indent_style = tab

# Indentation override for all JS under lib directory
[lib/**.js]
indent_style = space
indent_size = 2

# Matches the exact files either package.json or .travis.yml
[{package.json,.travis.yml}]
indent_style = space
indent_size = 2
```

### .vscode

根目录新建`.vscode文件夹`,在其中新建settings.json文件,覆盖本地的vscode配置,主要用来配合插件进行自动格式化

### Eslint

安装VS Code插件ESLint,并在.vscode/settings.json添加:

```js
{
  "editor.formatOnSave": true,
  "editor.formatOnType": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.codeAction.showDocumentation": {
    // 启用文档提示
    "enable": true
  },
  "eslint.options": {
    // 指定vscode的eslint所处理的文件的后缀
    "extensions": [".js", ".ts", ".tsx"]
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "html",
    "react",
    "typescript",
    "typescriptreact"
  ]
}

```

vite5.x自带eslint直接初始化即可

```js
npm init @eslint/config
```

根据需求进行配置:

```js
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · esm
√ Which framework does your project use? · react
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · browser
√ What format do you want your config file to be in? · JavaScript
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest eslint-plugin-react@latest @typescript-eslint/parser@latest
√ Would you like to install them now? · No / Yes
√ Which package manager do you want to use? · npm
```

稍后自动创建**.eslintrc.cjs**,

```js
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended'],
  overrides: [
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
  plugins: ['@typescript-eslint', 'react'],
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
```

配置eslint忽略文件,根目录新建: .eslintignore

```js
/node_modules
/dist
/public
/src/assets
根据项目进行配置
```

package添加命令,递归检查并修复src下的ts,tsx

```js
"scripts":{
    "lint": "eslint src/**/*.{ts,tsx} --fix",
    "prebuild": "npm run eslint || exit 1", //build之前自动执行
}
```

### Prettier

安装VS Code插件Prettier,并在.vscode/settings.json添加:

```js
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
}
```

安装依赖

```js
npm i prettier -D
```

创建**.prettierrc.cjs**文件 添加自定义格式化配置:

```js
module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  semi: true,
  trailingComma: 'none',
  bracketSpacing: true,
  quoteProps: 'as-needed',
  proseWrap: 'always', // 超过最大宽度是否换行<always|never|preserve>，默认preserve
  arrowParens: 'avoid', // 在单独的箭头函数参数周围包括括号 always：(x) => x \ avoid：x => x
  requirePragma: false, //无需顶部注释即可格式化
  insertPragma: false, //在已被preitter格式化的文件顶部加上标注
  trailingComma: 'none', //尾部逗号设置，es5是尾部逗号兼容es5，none就是没有尾部逗号，all是指所有可能的情况，需要node8和es2017以上的环境。（trailingComma: "<es5|none|all>"）
  bracketSameLine: false, // 将>多行 HTML（HTML、JSX、Vue、Angular）元素放在最后一行的末尾，而不是单独放在下一行（不适用于自关闭元素）<bool>，默认false
  singleAttributePerLine: true // 在 HTML、Vue 和 JSX 中强制执行每行单个属性<bool>，默认false
};
```

perttier忽略文件:根目录新建` .prettierignore`

```js
# prettier忽略文件
node_modules/
dist/
```

### ESLint和Prettier的冲突

```js
npm i eslint-config-prettier eslint-plugin-prettier -D
```

更改 Eslint 的配置文件 `.eslintrc.cjs` 在里面加入 Prettier 相关配置

```js
module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
+       "plugin:prettier/recommended"
    ],
    "plugins": [
        "react",
        "@typescript-eslint",
+       "prettier"
    ],
    "rules": {
+       "prettier/prettier": "error",
+       "arrow-body-style": "off",
+       "prefer-arrow-callback": "off"
        //自定义配置
    }
}
```

设置react版本:

```js
module.exports = {
  extends: [
    // ...
    'plugin:react/jsx-runtime'
  ],
  //...
  settings: {
    react: {
      version: 'detect'
    }
  }
};
```

统一编辑器配置,根目录新建`.vscode/settings.json`

```js
{
  "editor.formatOnSave": true, // 保存自动格式化
  "editor.formatOnType": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.codeAction.showDocumentation": {
    // 启用文档提示
    "enable": true
  },
  "eslint.options": {
    // 指定vscode的eslint所处理的文件的后缀
    "extensions": [".js", ".ts", ".tsx"]
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "html",
    "react",
    "typescript",
    "typescriptreact"
  ]
}
```

### Vite 中引入 ESLint

```js
npm i vite-plugin-eslint -D
```

vite.config.js中引入插件,可在运行时检查错误,并在控制台提示出来

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteEslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteEslint({
      failOnError: false
    })
  ]
});
```

### Husky

使用commot 的生命周期中自动代码校验,比如:在commit时,检验代码,不合格不可以commit

```js
npm install husky --save-dev
```

初始化配置文件,会在当前目录创建.husky目录，这里将是放置husky hooks的地方

```js
npx husky install
```

在package.json中添加命令,配置husky自动安装,便于团队使用,如此执行完npm install，将自动执行`husky install`初始化husky配置

```js
"scripts": {
    "prepare": "husky install"
}
```

添加pre-commit hook将在下文配置完lint-staged之后统一添加:

### lint-staged

lint-staged可以只针对待提交区(staged)的文件做一些处理

```js
npm install lint-staged -D
```

在pre-commit钩子中自动执行lint-staged:

```js
npx husky add .husky/pre-commit "npx --no-install lint-staged"
```

package.json配置一下lint-staged:

```js
{
  "lint-staged": {
    "src/**/*.{css,less}": [ //对src下样式文件进行校验
      "prettier --write --parser css"
    ],
    "src/**/*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### styleLint -less

安装less,安装完成可以直接使用:

```js
npm install -D less
```

vite.config.js中配置:

```js
export default defineConfig({
  css: {
    // 预处理器配置项
    preprocessorOptions: {
      less: {
        math: 'always',
        globalVars: {
          //配置全局变量
          blue: '#1CC0FF'
        },
        additionalData: '@import "./src/global.less";  ' // 或者自动将全局变量文件引入每个less文件中
      }
    }
  }
});
```

安装vscode插件: stylelint

.vscode/settings.json中添加:

```js
{
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": "explicit" //stylelint 自动修复
  },
  // 配置stylelint检查的文件类型范围
  "stylelint.validate": ["css", "less", "postcss", "scss", "sass", "vue"],
  "stylelint.enable": true,
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false
  //
}

```

安装依赖:

```js
npm i stylelint@^14.14.0 stylelint-config-standard@^28.0.0 stylelint-config-rational-order stylelint-config-prettier postcss-less -D

安装时需要去gitHub看一下版本是否对应,这几个依赖之间的最新版本可能不相互支持,需要找一个中间版本
```

新建styleLint配置文件:`.stylelintrc.cjs`

```js
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
```

配置忽略文件:`.stylelintignore`

```js
*.js
*.ts
*.tsx
*.jpg
*.png
*.ttf
*.svg
node_modlue/**/*
dist/**/*
```

package.json中添加命令:

```js
"style": "stylelint \"src/**/*.(less|css)\" --fix"
```

同时配置一下lint-staged:

```js
"lint-staged": {
    "src/**/*.{css,less}": [
      "stylelint --fix", //添加
      "prettier --write --parser css"
    ],
    "src/**/*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ]
}
```

- 

### React-router

安装

```js
npm install react-router-dom@6
```

使用方式:[官网](https://reactrouter.com/en/main/start/overview)

### antd组件库

```js
npm install antd --save
```

antd天然支持按需引入`import {....} from 'antd'`即按需引入

### axios

```js
npm i axios
```

封装:

目录结构

```js
service
├─ http
│  ├─ axios.ts
│  ├─ config.ts
│  ├─ httpTools.ts
│  └─ index.ts
└─ index.ts   // 封装好的接口函数
```

axios.ts

```js
import axios from 'axios';
import { handleNetErr, handleAuthError, handleRequestHeader, handleAuth } from './httpTools';
import { serviceConfig } from './config.ts';

const { baseURL, useTokenAuthorization, timeout, withCredentials } = serviceConfig;
const service = axios.create({
  baseURL,
  timeout,
  withCredentials
});

service.interceptors.request.use(config => {
  // 其他调整
  config = handleRequestHeader(config, {});
  if (useTokenAuthorization) {
    // 添加token
    config = handleAuth(config);
  }

  return config;
});

service.interceptors.response.use(
  res => {
    if (res.status === 200) {
      // 检测授权错误
      handleAuthError(res);

      return Promise.resolve(res.data.data);
    } else {
      return Promise.reject(res);
    }
  },
  err => {
    // 检测网络错误
    handleNetErr(err);

    return Promise.reject(err);
  }
);

export default service;
```

config.ts

```js
interface ErrMap {
  [key: string]: string;
}

// 请求配置
export const serviceConfig = {
  baseURL: import.meta.env.VITE_BASE_URL,
  useTokenAuthorization: false, //开启token验证
  timeout: 10000,
  withCredentials: false
};

// 网络错误配置
export const netWorkErrMap: ErrMap = {
  '302': '接口重定向了',
  '400': '参数不正确!',
  '401': '您未登录，或者登录已经超时，请先登录！',
  '403': '您没有权限操作!',
  '404': `请求地址出错!`,
  '405': '请求方法不被允许!',
  '408': '请求超时！',
  '409': '系统已存在相同数据！',
  '500': '服务器内部错误！',
  '501': '服务未实现！',
  '502': '网关错误！',
  '503': '服务不可用！',
  '504': '服务暂时无法访问，请稍后再试！',
  '505': 'HTTP 版本不受支持！'
};

export const authErrMap: ErrMap = {
  '10031': '登录失效，需要重新登录', // token 失效
  '10032': '您太久没登录，请重新登录~', // token 过期
  '10033': '账户未绑定角色，请联系管理员绑定角色',
  '10034': '该用户未注册，请联系管理员注册用户',
  '10035': 'code 无法获取对应第三方平台用户',
  '10036': '该账户未关联员工，请联系管理员做关联',
  '10037': '账号已无效',
  '10038': '账号未找到'
};

```

httpTools.ts

```js
import { message } from 'antd';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { netWorkErrMap, authErrMap } from './config.ts';

// 添加token
export const handleRequestHeader = (config: InternalAxiosRequestConfig<any>, otherConfig: object) => {
  return { ...config, ...otherConfig };
};
// 添加限权
export const handleAuth = (config: InternalAxiosRequestConfig<any>) => {
  config.headers['Authorization'] = localStorage.getItem('token') || '';
  return config;
};

// 匹配网络错误
export const handleNetErr = (error: { response: { status: string } }) => {
  const { status } = error.response;
  const errMsg = netWorkErrMap[status] || '未知错误';
  //显示错误
  message.error({ content: errMsg, duration: 2 });
};
// 匹配授权错误
export const handleAuthError = (res: AxiosResponse<any>) => {
  const { code } = res.data;
  const errMsg = authErrMap[code] || '未知错误';
  message.error({ content: errMsg, duration: 2 });

  // 登出
};

/**
 * @message: await错误处理
 * @param {Promise} promise
 * @return {Array} [值,错误]
 * @since: 2023-07-09 16:41:23
 */
export function cleanRes(promise: Promise<any>) {
  return promise.then(
    data => [data, null],
    err => [null, err]
  );
}
/**
 * @message: obj转querystring ?a=1&b=2
 * @param {object} obj
 * @return {string}
 * @since: 2023-12-16 17:04:45
 */
export const getQueryString = (obj: object | undefined) => {
  if (obj && isJsonObj(obj)) {
    return (
      '?' +
      Object.entries(obj)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    );
  }
  return '';
};

/**
 * @message: 判断谁否是可转换为json的对象
 */
function isJsonObj(obj: object) {
  try {
    JSON.stringify(obj);
    return true;
  } catch {
    return false;
  }
}

```

http/index.ts

```js
import service from './axios.ts';
import { getQueryString, cleanRes } from './httpTools.ts';

// 封装get,post,put等方法
export const get = (url: string, query: object | undefined) => {
  return cleanRes(
    service({
      url: url + getQueryString(query),
      method: 'get'
    })
  );
};

export const post = (url: string, data: object) => {
  return cleanRes(
    service({
      url: url,
      method: 'post',
      data
    })
  );
};
```

service/index.ts

```js
import { get, post } from './http';
// 获取用户数据

const getUserInfo = (data: { id: string }) => {
  return get('/api/use', data);
};
const addUserInfo = (data: { name: string }) => {
  return post('/api/use', data);
};

export default {
  getUserInfo,
  addUserInfo
};
```

### aHooks

引入常用基础hooks,避免大家封装基础hook不统一的问题

```js
npm install --save ahooks
```

### classnames

判断类名更加简洁,减少类名判断的三元表达式

```js
npm install --save classnames
```

使用

```js
import classNames from 'classnames/bind';
import styles from './submit-button.css';

let cx = classNames.bind(styles);

const Button = (props) => {
    const {base=true,inprogress=false,error=false,disabled=false} = props
    let className = cx('test',{
      base: base,
      inProgress: inprogress,
      error: error,
      disabled: disabled,
    });
    return(
        <button className={className}>{text}</button>;
    )
}
实际渲染效果:
<button className={test base}>{text}</button>
```

### TODO

#### 状态管理

zustand,mobx或者直接封装context+reducer

#### HOF重构http模块

做一个统一函数式基础范式

### 单元测试

vitest

1. 安装 

   ```js
    npm i -D vitest
    
    npm i -D jsdom @testing-library/react @vitest/coverage-v8 
   jsdom:  vitest依赖的基础库,用于在单元测试时，通过提供 Browser API 模拟浏览器环境
   @testing-library/react: 让vitest支持react
   @vitest/coverage-v8 是一个为Vitest提供代码覆盖率报告的插件，它基于V8引擎的内建代码覆盖率工具。在执行单元测试时，此插件可以收集和生成关于源代码中哪些部分被测试覆盖了的信息，最终输出一份详细的覆盖率报告。
   ```

2. 配置文件可以使用vite.config.ts,同时resolve.alias和plugins共享,添加如下配置(当然也可新建`vite.config.ts`单独配置,该文件优先级最高):
   ```
   如果使用和vite相同的配置文件,需要使用三斜线命令添加对vitest的引用,
   /// <reference types="vitest" />
   import { defineConfig } from "vite";
   
     test: {
       globals: true,
       environment: 'jsdom', //提供浏览器API以模拟浏览器环境
       coverage: {
         provider: 'v8',
         reporter: ['text', 'json', 'html']
       }
     },
   ```

3. 命令行

   ```js
   {
     "scripts": {
       "test": "vitest",
       "coverage": "vitest run --coverage" //生成代码覆盖率报告
     }
   }
   ```

4. 配合lint-staged使用,提交时自动对修改过的文件进行测试

   ```js
   package.json
   {
     "lint-staged": {
       "*.{js,ts,tsx}": ""*.{js,ts,tsx}": "vitest --changed HEAD~1 --run""
     },
   }
   ```

5. vscode插件安装: Vitest [地址](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer)

   ```js
   在 vscode 中运行/调试 vitest 测试
   支持🎊监视模式。测试重运行速度极快
   
   
   vitest.enable ：此插件将尝试检测当前项目是否设置了 Vitest 以激活自身。失败时，您可以手动启用插件
   vitest.nodeEnv ：传递给运行进程的 env 除了 process.env
   vitest.commandLine ：启动 vitest 测试的命令行。它应该具有附加额外参数的能力。例如 npx vitest ，或 yarn test -- .（这是一个工作区设置。请勿直接在用户设置中更改，这会影响您打开的所有项目）
   vitest.include: Include glob for test files. Default: [\"**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}\"]
   vitest.include ：包含测试文件的 glob。违约： [\"**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}\"]
   vitest.exclude: Exclude globs for test files. Default: [\"**/node_modules/**\", \"**/dist/**\", \"**/cypress/**\", \"**/.{idea,git,cache,output,temp}/**\"]
   vitest.exclude ：排除测试文件的 glob。违约： [\"**/node_modules/**\", \"**/dist/**\", \"**/cypress/**\", \"**/.{idea,git,cache,output,temp}/**\"]
   vitest.debugExclude: Automatically skip files covered by these glob patterns. Default: [\"<node_internals>/**\", \"**/node_modules/**\"]
   vitest.debugExclude ：自动跳过这些 glob 模式覆盖的文件。违约： [\"<node_internals>/**\", \"**/node_modules/**\"]
   ```

6. 测试编写

   ```js
   假设我们src/components下有一个Button组件,在src下新建tests/components/button.test.tsx文件,其中编写我们需要测试的代码
   在编写测试之前我们需要搞清楚两件事: 测什么和期望的结果是什么:
   测试什么:
   1.组件是否成功渲染
   2.传入参数1,是否组件状态是否成功响应
   3.传入参数2,是否组件状态是否成功响应
   ...
   4.按钮点击时,事件是否正常触发 等等
   
   测试函数也是这样的套路
   ```

   测试组件:

   ```js
   Button组件代码:
   interface ButtonProps {
     onClick?: () => void;
     disabled?: boolean;
   }
   const Button: React.FC<ButtonProps> = ({ onClick, disabled = false }) => {
     return (
       <>
         <button
           onClick={onClick}
           disabled={disabled}
         >
           按钮
         </button>
       </>
     );
   };
   
   export default Button;
   
   测试文件代码:button.test.tsx
   // 引入测试库函数，用来 mocking 模拟操作
   import { render, fireEvent } from '@testing-library/react';
   // 引入测试 api ，用来编写用例的逻辑
   import { describe, it, expect, vi } from 'vitest';
   // describe 将多个测试用例集成,用于测试一个组件多个测试点
   // it 同test 定义一个测试用例
   // expect 用来断言，期望
   
   // 引入被测试组件
   import Button from './index';
   
   // 测试思路:
   // 1.需要测试什么
   //    1.点击按钮是否触发回调函数
   //    2.传递参数disabled是否禁用按钮
   
   describe('click and disabled', () => {
     it('test click', () => {
       // 生成测试所需的函数,用于传递给button
       const handleCallback = vi.fn();
       // 渲染button
       const button = render(<Button onClick={handleCallback} />);
       // 组件被渲染之后，通过 getByRole 查询到组件的 dom 节点
       const element = button.getByRole('button');
       // 触发点击事件
       fireEvent.click(element);
       // 检查事件是否被成功触发
       expect(handleCallback).toHaveBeenCalled();
     });
     it('test disable', () => {
       // 生成测试回调函数
       // 渲染button并添加disable属性
       // 获取渲染到的button
       // 触发点击事件
       // 断言点击事件是否未触发
       const handleCallback = vi.fn();
       const button = render(
         <Button
           onClick={handleCallback}
           disabled={true}
         />
       );
       const element = button.getByRole('button');
       fireEvent.click(element);
       expect(handleCallback).not.toHaveBeenCalled();
     });
   });
   ```

### commit规范-交互式提交

#### commitlint

```js
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

新建.commitlintrc.cjs并添加配置信息:

```js
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```

添加commit-msg钩子:

```js
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

#### 交互式提交

@commitlint/cz-commitlint是commitlint官方提供的,配置项主要包括：messages和questions两部分。

安装依赖:

```js
npm install @commitlint/cz-commitlint commitizen -D
```

package.json中配置commitizen:

```js
"config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
}
```

.commitlintrc.js并新增配置信息:

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    settings: {
      enableMultipleScopes: true, // 支持多scope
      scopeEnumSeparator: ',' // 多scope分隔符
    },
    messages: {
      skip: '<可跳过>',
      max: '最多输入 %d 个字符',
      min: '至少需要输入 %d 个字符',
      emptyWarning: '不能为空',
      upperLimitWarning: '超过长度限制',
      lowerLimitWarning: '未达到最少数字要求'
    },
    questions: {
      type: {
        description: '选择你要提交的信息类型 ',
        enum: {
          feat: {
            description: '新功能',
            title: 'Features',
            emoji: '✨'
          },
          fix: {
            description: '修复bug',
            title: 'Bug Fixes',
            emoji: '🐛'
          },
          docs: {
            description: '书写文档',
            title: 'Documentation',
            emoji: '📚'
          },
          style: {
            description: '代码格式化(空格, 格式化, 分号等)',
            title: 'Styles',
            emoji: '💎'
          },
          refactor: {
            description: '代码重构',
            title: 'Code Refactoring',
            emoji: '📦'
          },
          perf: {
            description: '性能优化提升',
            title: 'Performance Improvements',
            emoji: '🚀'
          },
          test: {
            description: '测试',
            title: 'Tests',
            emoji: '🚨'
          },
          build: {
            description: '调整构建或者依赖',
            title: 'Builds',
            emoji: '🛠'
          },
          ci: {
            description: '调整持续集成',
            title: 'Continuous Integrations',
            emoji: '⚙️'
          },
          chore: {
            description: '变更构建流程或者辅助工具',
            title: 'Chores',
            emoji: '♻️'
          },
          revert: {
            description: '代码回退',
            title: 'Reverts',
            emoji: '🗑'
          }
        }
      },
      scope: {
        description: '提交信息类型(模块、组件、页面)'
      },
      subject: {
        description: '简洁明了的修改摘要'
      },
      body: {
        description: '详细的调整信息描述'
      },
      isBreaking: {
        description: '是否有非兼容性的调整？'
      },
      breaking: {
        description: '请输入非兼容调整的详细描述'
      },
      isIssueAffected: {
        description: '是否有关闭 issue'
      },
      issues: {
        description: '列举关闭的 issue (例如 "fix #123", "re #123")'
      }
    }
  }
};
```

git commit`命令需要统一调整为 `:`npx git-cz`,亦可以将改命令添加到package.json中,方便后续使用:

```js
"scripts": {
    "commit": "npx git-cz"
},
```

### 版本管理规范

#### 变更日志(change log)

变更日志是对项目所做更改的详细记录，通常包括修复和新功能。变更日志通常由按时间顺序排列的列表组成，详细列出已进行的更改以
及更改的执行者。变更日志文件通常被组织成段落，描述与特定目标相关的所有更改。每个段落通常以更改日期、作者姓名和电子邮件地
址开头。列出每个修改过的文件的名称，以及被更改的功能或部分。还经常提供关于更改的简要原因和一些详细信息。

变更日志在涉及许多开发人员的项目中至关重要，尤其开源项目。在任何项目中，变更日志都是有用的，因为了解以前的版本与当前版本
的不同之处可能很重要。例如，发行说明通常基于项目变更日志，通常包括缺陷修复和产品增强。

#### 生成变更日志(change log)

自动生成`change log`是建立在约定式提交的基础上。前面我们已经详细讨论和实现了约定式提交规范。已经具备自动生
成`change log`的条件，只要合适的工具，就能方便快速的自动生成`change log`。常用的工具主要有下面几个：

#### conventional-changelog-cli

安装

```shell
shell
复制代码npm install -g conventional-changelog-cli
```

在package.json，配置生成变更日志的npm script命令:

```json
json复制代码{
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s &&  git add CHANGELOG.md"
}
```

上面的命令只生成后续新的日志信息，不会覆盖前面到日志信息。而且仅提取匹配“功能(feat)”、“修复(fix)”、“性能改进(perf)”或“破
坏性变更(refactor)”等类型的commit信息，生成日志信息到CHANGELOG.md文件。如果想重新生成全部的日志信息，需要用以下命令，这
会覆盖前面生成的日志信息。

```shell
shell
复制代码conventional-changelog -p angular -i CHANGELOG.md -s -r 0
```

conventional-changelog-cli有相应的推荐工作流程：

1. 提交修改信息 commit change
2. 修改`package.json`中的`version`
3. 执行`npm run changelog`生成日志
4. 提交package.json和Changelog.md文件
5. 打tag
6. push到远程git库

这里有两点需要说明：

- 生成日志之前需要，修改版本号
- 生成日志之后再打tag，保证新的release版本中包含最新的changelog信息

### CI/CD

使用`gh-pages`库可以将项目部署到静态网站上

```js
npm i gh-pages -D
```

#### 手动部署

package.json添加命令

```js
"deploy": "gh-pages -d dist -r https://github.com/LAF523/eslintTest.git -b gh-pages"  // 地址替换一下
命令含义: -d dist指定推送到gitHub Pages的目录 -r指定git仓库地址  -b指定推送到哪个分支
```

vite.config.js 中根据一下情况设置正确的 base

```js
如果你正要部署到 https://<USERNAME>.github.io/，或者通过 GitHub Pages 部署到一个自定义域名（例如 www.example.com），请将 base 设置为 '/'。或者，你也可以从配置中移除 base，因为它默认为 '/'。

如果你正在部署到 https://<USERNAME>.github.io/<REPO>/（例如你的仓库地址为 https://github.com<USERNAME>/<REPO>），那么请将 base 设置为 '/<REPO>/'。


同时注意项目路由的基础路径也要设置一下保持一致
```

运行构建和部署命令

```js
npm run build
npm run deploy
```

前往gitHub项目仓库中:

```js
setting => 侧边栏Pages => 查看Build and deployment选项中分支是否正确和是否为:root,(默认是gh-pages分支) => 点击save => 上方显示网址便是部署好的地址
```

#### 自动化构建/部署

使用GitHub Actions构建自动化部署流程,不在使用`gh-pages`包,本项目使用该种方式配置

```js
先设置一下项目的baseurl,防止部署后路由和地址不一致
1.如果是hostroy模式的路由还需要配置nginx代理,否则刷新页面404
2.这里使用hash模式
```

项目根目录新建`.github/workflows/deploy.yaml`文件,添加部署流程:在向主分支push代码的时候自动执行构建和部署:

```js
# 将静态内容部署到 GitHub Pages 的简易工作流程
name: Build and Deploy # 工作流名称 如省略使用当前文件名
run-name: Deploy by @${{ github.actor }} - ${{ github.event.head_commit.message }} # 工作流运行时的名称 作者 如省略显示提交时的commit信息

on:
  # 监听push动作,仅在推送到默认分支时运行。
  push:
    branches: ['main']
    paths-ignore:   # 下列文件的变更不触发部署，可以自行添加
      - README.md

  # 这个选项可以使你手动在 Action tab 页面触发工作流
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages。
permissions:
  contents: read
  pages: write
  id-token: write

# 允许一个并发的部署
concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  # 定义一个名为 deploy 的工作流
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout  # clone该仓库源码到工作流中
      uses: actions/checkout@v4

    - name: Set up Node  # 设置node环境,指定node版本为20,并缓存npm包提升后续执行速度
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'

      # 缓存 npm node_modules
    - name: Cache dependencies
      uses: actions/cache@v3
      with:
        path: ~/.npm
        key: ${{ runner.os }}-npm-cache-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-npm-cache-

      # 安装依赖 npm
    - name: Install dependencies
      # 如果没有命中缓存才执行 npm install
      if: steps.cache-deps.outputs.cache-hit != 'true'
      run: npm install

    - name: Build With Vite
      run: npm run build

    # 部署到 GitHub pages
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3 # 使用部署到 GitHub pages 的 action
      with:
        publish_dir: dist # 部署打包后的 build 目录
        github_token: ${{ secrets.ACCESS_TOKEN }} # secret 名
        commit_message: 自动部署 # 部署时的 git 提交信息，自由填写
```

在gitHub中申请token,

```js
1. 用户的Settings中 => 最下方Developer settings => Personal access tokens => Tokens => 右上角Generate new token => 设置过期时间, => Select scopes中选择repo和workflow => 复制token只出现一次保存好

2. 回到项目仓库 => Settings => Secrets =>New repository secret => 命名要和上述yaml文件中github_token字段值的命名ACCESS_TOKEN一致

3.Pages中将Build and deployment的值设置为gh-pages /(root) 点击save
```

这将在push或者同意pr到main分支的时候自动执行构建部署

### 整体文件目录结构

> 使用tree-node-cli生成
>
> `treee -L 4 -I "node_modules|.git" -a --dirs-first`

```js
react-template
├── .husky
│   ├── _
│   │   └── husky.sh
│   ├── commit-msg
│   └── pre-commit
├── .vscode
│   └── settings.json
├── dist
│   ├── assets
│   │   ├── index-5eLZ2vov.css
│   │   ├── index-xAMt-rJf.js 
│   │   └── react-h3aPdYU7.svg
│   ├── index.html
│   └── vite.svg
├── env
│   ├── .env
│   ├── .env.development      
│   ├── .env.local
│   └── .env.production       
├── public
│   └── vite.svg
├── src
│   ├── assets
│   │   └── react.svg
│   ├── common
│   ├── components
│   │   └── button
│   │       └── index.tsx
│   ├── layouts
│   ├── pages
│   ├── routes
│   ├── service
│   │   ├── http
│   │   │   ├── axios.ts
│   │   │   ├── config.ts
│   │   │   ├── httpTools.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── stores
│   ├── styles
│   ├── tests
│   │   └── components
│   │       └── button.test.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .commitlintrc.cjs
├── .editorconfig
├── .eslintignore
├── .eslintrc.cjs
├── .prettierignore
├── .prettierrc.cjs
├── .stylelintignore
├── .stylelintrc.cjs
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
