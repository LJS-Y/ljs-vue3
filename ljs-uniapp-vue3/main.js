import App from './App'
import store from './store'
import '@/router/callback.js'; // permission control

/*每个页面公共css */
import "@/assets/css/base.scss"; 
import "@/assets/fonts/iconfont.css";

// 全局注入公共JS-SDK
import ljsPublic from './uni_modules/ljs-sdk-public/js_sdk/index.js'
import base from '@/tools/base.js'
import ljsAPI from '@/request/index.js' // API
import CONFIG from "@/request/config.js" // 全局配置

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$ljsPublic = ljsPublic;
Vue.prototype.$base = base;
Vue.prototype.$API = ljsAPI;
Vue.prototype.$CONFIG = CONFIG;

const app = new Vue({
  ...App
})
app.use(store);
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.config.globalProperties.$ljsPublic = ljsPublic;
	app.config.globalProperties.$base = base;
	app.config.globalProperties.$API = ljsAPI;
	app.config.globalProperties.$CONFIG = CONFIG;
	app.use(store);
	return {
		app
	}
}
// #endif