import router from './index'
import store from '../store';
import { ElMessage } from 'element-plus';
import { LJSsession, LJSmenu } from 'ljs-tools';
import { getInfo } from '@/api/common/login';
import img_head from '@/assets/images/common/head.png';

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

  const ROUTER_REDIRECT = LJSsession.getSS('ROUTER_REDIRECT');
  // 动态路由加载重定向
  if (!to.name) {
    if (ROUTER_REDIRECT === true) {
      LJSsession.clearVuex(store);
      ElMessage.info('路由重定向错误，请联系管理员。');
      return next('/login');
    }
    store.commit('loadingStore', {
      tag: true,
      text: '加载中....'
    });
    LJSsession.setSS('ROUTER_REDIRECT', true);
    const res = await store.dispatch('GenerateRoutes', {
      moduleId: store.getters.module.id
    });
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
  LJSsession.setSS('ROUTER_REDIRECT', false);
  return next();
});

// 无用户信息需获取
async function getUserInfo(next) {
  // 获取用户信息
  const res2 = await getInfo();
  if (res2) {
    // 处理用户头像
    let avatar = res2.user.avatar;
    avatar = (avatar == "" || avatar == null) ? img_head : import.meta.env.PUBLIC_API_URL + avatar;
    res2.user.avatar = avatar;
    // 存储用户、权限
    store.commit('SET_userinfo', res2.user);
    store.commit('SET_permissions', res2.permissions);
    // 获取菜单
    const res3 = await store.dispatch('GenerateRoutes', {
      moduleId: store.getters.module.id
    });
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