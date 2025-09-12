import router from './index'
import store from '../store';
import { LJSsession } from 'ljs-tools';
import $base from '@/tools/base';
import { getInfo } from '@/api/common/login';

/**
 * 路由的钩子函数，处理是否登录的判断
 * **/
router.beforeEach(async (to, from, next) => {
  // 监测是否有用户数据
  const userinfo = store.getters.userinfo;

  const token = store.state.token;
  if (token === null && to.path !== '/login') {
    return next('/login');
  }
  
  // 监测是否有用户数据
  if (token !== null && userinfo === null) {
    return getUserInfo(next);
  }

  // 如果有Token，但是访问的是登录页
  if(token !== null && to.path === '/login'){
    const menuNowOpen = store.state.menuNowOpen;
    // 从哪里来的，回哪里去
    return next(menuNowOpen.url);
  }

  // 如果有Token，但是访问的是/
  if(token !== null && to.path === '/'){
    LJSmenu.fristOpenMenu(store);
    const menuNowOpen = store.state.menuNowOpen; 
    return next(menuNowOpen.url);
  }
  
  // 404 判定
  if (to.path !== '/404' && !determine404(to.path)) {
    return next('/404');
  }

  // 动态路由加载重定向
  if (!to.name) {
    store.commit('loadingStore', {
      tag: true,
      text: '加载中....'
    });
    const res = await store.dispatch('GenerateRoutes');
    if (res) {
      store.commit('loadingStore', {
        tag: false,
        text: '加载中....'
      });
      return next(to.path);
    } else {
      LJSsession.clearVuex(store);
      return next('/login');
    }
  }

  // 如果有Token，并且没有获取用户信息呢
  // if(token && !hasGetUserInfo){
  // 	// 拉取用户信息去，如果token过期或者被非法篡改，会在axios的拦截器中进行处理。
  // 	const getInfoRes = await store.dispatch("getInfo");
  // 	// 进行追加路由
  // 	addRouters(getInfoRes.menus);
  // 	// 将hasGetUserInfo置true
  // 	hasGetUserInfo = true;
  // }
  
  store.commit('loadingStore', {
    tag: false,
    text: '加载中....'
  });
  return next();
});

// 无用户信息需获取
async function getUserInfo(next) {
  // 获取用户信息
  const res2 = await getInfo();
  if (res2) {
    // 处理用户头像
    let avatar = res2.user.avatar;
    const defaultSrc = $base.getImageUrl('images/common/head.png');
    avatar = (avatar == "" || avatar == null) ? defaultSrc : import.meta.env.VITE_APP_API_URL + avatar;
    res2.user.avatar = avatar;
    // 存储用户、权限
    store.commit('SET_userinfo', res2.user);
    store.commit('SET_permissions', res2.permissions);
    // 获取菜单
    const res3 = await store.dispatch('GenerateRoutes');
    if (res3) {
      LJSmenu.fristOpenMenu(store);
      const menuNowOpen = store.state.menuNowOpen;
      // console.log('监测路由是否存在', router.hasRoute(menuNowOpen.name));
      return next(menuNowOpen.url);
    }
  }
  LJSsession.clearVuex(store);
  return next();
}

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