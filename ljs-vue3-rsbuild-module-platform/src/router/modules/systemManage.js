
export default [
  {
    path: '/systemManage/editUserInfo',
    name: 'editUserInfo',
    hidden: true, // 菜单隐藏，路由不隐藏
    component: () => import('@/views/systemManage/system/user/profile/index.vue')
  },
  {
    path: '/systemManage/system/dictData',
    name: 'systemDictData',
    hidden: true, // 菜单隐藏，路由不隐藏
    component: () => import('@/views/systemManage/system/dict/data.vue')
  },
  {
    path: '/systemManage/monitor/jobLog',
    name: 'jobLog',
    hidden: true, // 菜单隐藏，路由不隐藏
    component: () => import('@/views/systemManage/monitor/job/log.vue')
  },
];