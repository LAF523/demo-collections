// 物料区,通用组件不包含业务,可以用来构建中台物料库,或通用组件库
//  所有物料组件统一在这里注册

import { App } from 'vue';

export default {
  // 自动注册组件
  install(app: App<Element>) {
    const modules = import.meta.glob('./*/*.vue');
    Object.entries(modules).forEach(([key, val]: [string, () => Promise<unknown>]) => {
      const componentName = key.split('/')[1];
      app.component(`M${componentName}`, defineAsyncComponent(val as () => Promise<Component>));
    });
  }
};
