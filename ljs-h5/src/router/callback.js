import router from './index.js'
import store from '../store/index.js';
import COMMON from '@/tools/common'

/**
 * 路由的钩子函数，处理是否登录的判断
 * **/
router.beforeEach(async (to, from) => {
  
  if (!COMMON.checkToken(to)) {
    // 常规登录模式，需创建登录页面
    const token = store.state.token;
    if (token === null && to.path !== '/login') {
      return '/login';
    }
    // 外部跳转模式，需携带有效token
    // return '/404';
  }
  
  // 404 判定
  const check404 = determine404(to.path)
  if (to.path !== '/404' && !check404) {
    return '/404';
  }
  
  store.commit('loadingStore', {
    tag: false,
    text: '加载中....'
  });
  return true;
});

// 地址是否存在于路由中
function determine404(path) {
  const routerList = store.getters.routerList;
  const nowList = router.getRoutes();
  
  let allRouters = [];
  if (routerList.length === 0) {
    allRouters = nowList;
  } else {
    allRouters = routerList;
  }
  
  // console.log(allRouters);
  const nums = allRouters.length;
  for (let i = 0; i < nums; i++) {
    if (allRouters[i].path === path) {
      return true;
    }
  }
  return false;
}