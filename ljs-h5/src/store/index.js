import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate';
import mutations from './mutations.js';
import getters from './getters.js';

// 持久化某几个数据
const PERSIST_PATHS = ['token', 'userinfo', 'apiShake', 'permissions', 'roles', 'menuList', 'routerList', 'menuOpenList', 'menuNowOpen', 'menuShrink', 'frameTheme'];
const store = createStore({
    state: {
      submitDDTag: false, // 提交 - 防抖动 - 针对快速请求问题的拦截机制
      // 全局 - 加载中....
      // 如需要局部loading，请使用v-loading
      loading: {
        tag: false,
        text: '加载中....'
      },
      token: null, // token
      userinfo: null, // 用户信息
      apiShake: [], // 抖动请求
      permissions: [], // 权限列表
      roles: [], // 角色列表
      routerList: [], // router数据
      menuList: [], // 菜单数据
      menuOpenList: [], // 被打开菜单的集合 - 管理端
      menuNowOpen: null, // 菜单选择的路由地址 - 管理端
      menuShrink: false, // 菜单是否收起 - 管理端
      screenWidth: 0, // 浏览器宽度 - 监测
      frameTheme: 'default' // 主题
    },
    mutations: mutations,
    actions: {},
    getters: getters,
    plugins: [
      createPersistedState({
        storage: window.sessionStorage,
        paths: PERSIST_PATHS
      })
    ]
})
export default store;