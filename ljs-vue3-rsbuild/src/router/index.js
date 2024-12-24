import { createRouter, createWebHistory } from 'vue-router';
const routerHistory = createWebHistory(import.meta.env.BASE_URL);
// 子路由
// import defaultRouter from './default';

// 基础路由
export const constantRoutes = [
  {
    path: '/',
    name: 'frame',
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    },
    component: () => import('@/views/frame/frame.vue'),
    children: []
  },
  {
    path: '/login', // 登录页面
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/404', // 页面不存在的情况下会跳到404页面
    name: '404',
    component: () => import('@/views/404.vue')
  },
  {
    path: '/empty', // 中间页
    name: 'empty',
    component: () => import('@/views/empty.vue')
  },
];

export const dynamicRoutes = [
  {
    path: '/index',
    name: 'Index',
    meta: {
      title: '首页',
      icon: 'index',
      keepAlive: false // 配置是否缓存
    },
    component: () => import('@/views/index/index.vue')
  },
  {
    path: '/ljs',
    name: 'Ljs',
    meta: {
      title: '关于ljs-vue3框架',
      icon: 'personnel',
      keepAlive: false // 配置是否缓存
    },
    component: () => import('@/views/ljs/index.vue')
  },
  {
    path: '/editUserInfo',
    name: 'editUserInfo',
    hidden: true, // 菜单隐藏，路由不隐藏
    component: () => import('@/views/system/user/profile/index.vue')
  },
  {
    path: '/system/dictData',
    name: 'systemDictData',
    hidden: true, // 菜单隐藏，路由不隐藏
    component: () => import('@/views/system/dict/data.vue')
  },
  {
    path: '/monitor/jobLog',
    name: 'jobLog',
    hidden: true, // 菜单隐藏，路由不隐藏
    component: () => import('@/views/monitor/job/log.vue')
  },
  // 可自行增加固定路由
];

export default createRouter({
  history: routerHistory,
  // vue-router4换了新的base配置方式。
  // base: import.meta.env.BASE_URL, // 如果nginx根目录html，有文件夹，如a，则history模式下需要配置为/a/，并且修改nginx.conf配置文件内容
  routes: constantRoutes
});
