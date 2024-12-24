import Vue from 'vue'
import App from './App'

//路径换成自己的
import {router,RouterMount} from '@/router/index.js'  
Vue.use(router)

//把vuex定义成全局组件
import store from './store'

Vue.config.productionTip = false
App.mpType = 'app'

// 全局注入公共JS-SDK
import ljsPublic from './uni_modules/ljs-sdk-public/js_sdk/index.js'
Vue.prototype.$ljsPublic = ljsPublic;
import base from '@/tools/base.js'
Vue.prototype.$base = base;
// API
import ljsAPI from '@/request/index.js'
Vue.prototype.$API = ljsAPI;
// 全局配置
import CONFIG from "@/request/config.js"
Vue.prototype.$CONFIG = CONFIG;

// 全局组件 - 底部菜单

const app = new Vue({
	...App,
	store
})

// 其他引入
import { checkPermi, checkRole } from '@/tools/permission.js' // plugins
Vue.prototype.checkPermi = checkPermi
Vue.prototype.checkRole = checkRole

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app,router,'#app')
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
