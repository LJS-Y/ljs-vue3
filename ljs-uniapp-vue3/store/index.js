import { createStore } from "vuex";
import mutations from './mutations';
import getters from './getters';
import permission from './modules/permission';

const store = createStore({
    state: {
		token: null, // token
		submitDDTag: false, // 提交 - 防抖动 - 针对快速请求问题的拦截机制
		userinfo: null, // 用户信息
		menuList: [], // 菜单
		permissions: [], // 权限列表
		roles: [], // 角色列表
    },
    mutations: mutations,
    actions: {},
    getters: getters,
   	modules: {
		permission
    },
})
export default store;