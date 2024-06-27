import { createApp } from 'vue';
import './styles/index.less';
import App from './App.vue';
import pinia from './stores/index.ts';
import router from '@/routes/index.ts';
import { useRemUnit } from '@/utils/flexible.ts';
import mLibs from './libs/index';
import mDirective from './direstives/index.ts';
import 'virtual:svg-icons-register';
import { useTheme } from './utils/theme.ts';

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(mLibs);
app.use(mDirective);
app.mount('#app');
useRemUnit();
useTheme();
