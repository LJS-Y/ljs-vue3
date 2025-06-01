
export default [
  {
    path: '/ai/index',
    name: 'AiIndex',
    hidden: true, // 菜单隐藏，路由不隐藏
    meta: {
      title: 'AI'
    },
    component: () => import('@/views/ai/index/index.vue')
  },
];