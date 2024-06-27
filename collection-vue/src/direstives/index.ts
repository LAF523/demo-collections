import { App } from 'vue';

export default {
  install(app: App<Element>) {
    const modules: Record<string, any> = import.meta.glob('./module/*.ts', { eager: true });
    Object.entries(modules).forEach(([path, module]) => {
      const name = path.match(/[^/]+(?=\.ts$)/)![0];
      app.directive(name, module.default);
    });
  }
};
