import router from './index.js'
import store from '../store/index.js';

/**
 * 路由的钩子函数，处理是否登录的判断
 * **/
router.beforeEach(async (to, from, next) => {
  
  // 404 判定
  if (to.path !== '/404' && !determine404(to.path)) {
    return next('/404');
  }
  
  store.commit('loadingStore', {
    tag: false,
    text: '加载中....'
  });
  return next();
});

// 地址是否存在于动态路由中
function determine404(path) {
  const routerList = store.getters.routerList;
  const nowList = router.getRoutes();
  const newList = [];
  nowList.forEach((item) => {
    newList.push({
      mate: item.mate,
      name: item.name,
      path: item.path
    });
  });
  const allRouters = newList.concat(routerList);
  const nums = allRouters.length;
  for (let i = 0; i < nums; i++) {
    if (allRouters[i].path === path) {
      return true;
    }
  }
  return false;
}