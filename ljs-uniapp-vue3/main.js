import App from './App'
import store from './store'
import '@/router/callback.js'; // permission control

/*每个页面公共css */
import "@/assets/css/base.scss"; 
import "@/assets/fonts/iconfont.css";

// 全局注入公共JS-SDK
import ljsPublic from './uni_modules/ljs-sdk-public/js_sdk/index.js'
import toolsBase from '@/tools/base.js'
import toolsCommon from '@/tools/common.js'
import ljsAPI from '@/request/index.js' // API
import CONFIG from "@/request/config.js" // 全局配置

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.config.globalProperties.$base = toolsBase;
	app.config.globalProperties.$com = toolsCommon;
	app.config.globalProperties.$API = ljsAPI;
	app.config.globalProperties.$CONFIG = CONFIG;
	app.config.globalProperties.$ljsBottomMenuRouter = true;
	app.use(ljsPublic, {
		beforeEachTag: false
	});
	app.use(store);
	return {
		app
	}
}
// #endif