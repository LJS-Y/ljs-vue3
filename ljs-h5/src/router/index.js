import { createRouter, createWebHistory } from 'vue-router';
const routerHistory = createWebHistory(import.meta.env.BASE_URL);
// AI
// import ai from './modules/ai';

// 基础路由
export const constantRoutes = [
  {
    path: '/',
    name: 'Frame',
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    },
    component: () => import('@/views/frame/index.vue'),
    children: [
      {
        path: '/',
        name: 'moduleIndex',
        hidden: true, // 菜单隐藏，路由不隐藏
        component: () => import('@/views/index/index.vue')
      },
      // ...ai
    ]
  },
  {
    path: '/404', // 页面不存在的情况下会跳到404页面
    name: '404',
    component: () => import('@/views/404.vue')
  }
];

export default createRouter({
  history: routerHistory,
  // vue-router4换了新的base配置方式。
  // base: import.meta.env.BASE_URL, // 如果nginx根目录html，有文件夹，如a，则history模式下需要配置为/a/，并且修改nginx.conf配置文件内容
  routes: constantRoutes
});
