import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import store from './store/index.js';

// svg图标
import '@/assets/icons/svg/index.js'

import '@/router/callback.js'; // permission control

import '@/assets/fonts/iconfont.css'; // 引入字体库(my - 框架 - 新框架)

// ElementUI - CDN模式，全局暴露的是 ELEMENT
import 'element-plus/dist/index.css';
// 全部注入
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import '@/assets/css/base.scss';

// tools
import 'ljs-tools/index.css';
import LjsTools from 'ljs-tools';
import tools from '@/tools/index.js';
import ButtonThrottle from 'throttle-box';


const app = createApp(App);
// tools
app.use(LjsTools);
app.use(tools);
app.use(ButtonThrottle);
// Element - 设置语言
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
app.use(ElementPlus, {
  locale: zhCn,
})
// Element - 注入Icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 在路由器启动初始导航前预加载动态路由，避免刷新动态路由地址时
// vue-router 因路由尚未注册而报 VUE_ROUTER_R0004 告警
(async () => {
  if (store.state.token && store.getters.userinfo) {
    try {
      await store.dispatch('GenerateRoutes');
    } catch (e) {
      // 预加载失败时交给路由守卫处理
    }
  }
  app.use(router).use(store);
  app.mount('#app');
})();
