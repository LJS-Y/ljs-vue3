import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import store from './store/index.js';

import '@/router/callback.js'; // permission control

import '@/assets/fonts/iconfont.css'; // 引入字体库(my - 框架 - 新框架)

import Vant from 'vant';
import 'vant/lib/index.css';

import '@/assets/css/base.scss';

// tools
import 'ljs-tools/index.css';
import LjsTools from 'ljs-tools';
import tools from '@/tools/index.js';
import ButtonThrottle from 'throttle-box';


const app = createApp(App);
// tools
app.use(Vant);
app.use(LjsTools);
app.use(tools);
app.use(ButtonThrottle);

app.use(router).use(store);
app.mount('#app');
