## 规范系列:
### 命名

- 组件文件: 首字母大写
- 文件夹: 小写
- 变量: 小驼峰

### 组织结构

> 根据功能划分文件夹结构
#### components

```js
├─ components 存放公共组件         
│  ├─ message 以文件夹起始,样式抽离为单独文件            
│  │  ├─ index.less        
│  │  └─ index.vue   
```

#### pages

```js
├─ pages              存放页面组件             
   ├─ home            主页     
      ├─ components   主页中抽离的组件     
      │  └─ Form      样式单独抽离     
      │     ├─ index.less  
      │     └─ index.vue   
      └─ index.vue    主页组件
```

#### stores

```js
├─ stores    全局状态管理              
   ├─ user   分模块定义             
   │  ├─ index.ts    定义数据       
   │  ├─ type.ts     定义ts类型      
   │  └─ useUserStore.ts   定义store的获取,修改等hook,
   └─ index.ts             将hook在此导出          
```

#### service

```js
service             
├─ request          
│  ├─ axios.ts      // axios封装
│  ├─ config.ts     // 请求配置
│  ├─ httpTools.ts  // 封装相关的方法
│  └─ index.ts      // 封装的get post方法
└─ user.ts          // 服务模块相关的请求
```

