/** 
 * @module base
 * @description 基础常用处理方法
 *  */
import store from '@/store/index.js';
import { LJSbase, LJSsession, LJSmenu } from 'ljs-tools';
import { getPermissionsInfo } from '@/api/common/module';
import RUN from '@/tools/run';

/**
 * 屏幕监听
 * @example 
App.vue调用：
this.$base.screenListen(); 
实际应用：
watch: {
  // 浏览器窗口宽度变化监听
  '$store.getters.screenWidth': {
    handler(n) {
      this.getModuleMenu();
    },
    deep: true
  },
  // 菜单变化监听 - 用于展开、选中等功能。
  'menu.list': {
    handler(n) {
      this.$store.commit('SET_menuList', this.menu.list);
      this.init();
    },
    deep: true
  }
}
 */
export function screenListen () {
  window.onresize = () => {
    store.commit('SET_screenWidth', document.body.clientWidth);
  }
}

/**
  *  检测浏览器分辨率
  *  @example this.$base.checkWindowRatio()
  * */
export function checkWindowRatio() {
  const ljs_window_ratio = LJSsession.getSS('ljs_window_ratio');
  if (LJSbase.fieldCheck(ljs_window_ratio)) {
    const ratio = LJSbase.getWindowRatio();
    if (ratio !== 100) {
      LJSsession.setSS('ljs_window_ratio', ratio);
      ElNotification({
        title: '系统提示',
        message: `您的浏览器分辨率为${ratio}%，建议设置为100%，浏览效果最佳。`,
        duration: 0,
      })
    }
  }
}

/**
 * 初始化皮肤
 * @param {String} initTheme 默认皮肤设置
 * @example this.$base.initSkin(); // 默认
 * @example this.$base.initSkin('blue'); // 配置blue为默认
 */
export function initSkin (initTheme) {
  let theme = LJSsession.getLS('FRAME_THEME');
  if (theme !== null) {
    store.commit('SET_frameTheme', theme);
  } else {
    theme = initTheme ? initTheme : store.getters.frameTheme;
    store.commit('SET_frameTheme', theme);
    LJSsession.setLS('FRAME_THEME', theme);
  }
  return theme;
}

/**
 * 获取动态内部图片资源
 * @param {String} url 本地资源文件地址
 * @example this.$base.getImageUrl('images/common/head.png'); 真实的地址为：/assets/images/common/head.png
 */
export function getImageUrl(url) {
  return new URL(`../assets/${url}`, import.meta.url).href;
}

/**
  *  默认图片
  *  @param {object} form 表单对象
  *  @param {string} key 键名不叫phone时需要传入新的键名
  *  @param {string} url 默认图片地址
  *  @example this.$base.picError(item, 'imgPath')
  * */
export function picError(form, key = 'src', url = 'images/common/errorImg.png') {
  form[key] = getImageUrl(url);
}

/**
  *  模块点击
  *  @param {object} obj 模块对象
  *  @example this.$base.itemClick(item, 'imgPath')
  * */
export async function itemClick(obj) {
  const openType = !LJSbase.fieldCheck(obj.openType) ? (obj.openType === '1' ? '_self' : '_blank') : '_self';
  if (obj.enable === '1') {
    RUN.goExternalUrl(obj.webUrl, openType);
    return;
  }
  // 全局
  if (obj.moduleType === '2') {
    store.commit('SET_module', obj);
    if (openType === '_self') {
      RUN.replace({
        path: obj.url
      })
    } else {
      RUN.goExternalUrl(obj.url);
    }
    return;
  }
  // 内嵌
  store.commit('loadingStore', {
    tag: true,
    text: '加载中....'
  });
  // 获取模块下角色、权限
  const res1 = await getPermissionsInfo({
    moduleId: obj.id
  });
  if (res1.code === 200) {
    store.commit('SET_permissions', res1.permissions);
    store.commit('SET_roles', res1.roles);
  }
  store.commit('SET_module', obj);
  // 获取模块下菜单
  store.commit('SET_menuList', []);
  const res2 = await store.dispatch('GenerateRoutes', {
    moduleId: obj.id
  });
  if (res2.data !== undefined && res2.data.length > 0) {
    LJSmenu.fristOpenMenu(store);
    const menuNowOpen = store.state.menuNowOpen;
    // console.log('监测路由是否存在', this.$router.hasRoute(menuNowOpen.name));
    if (menuNowOpen.url) {
      if (openType === '_self') {
        RUN.replace({
          path: menuNowOpen.url
        })
      } else {
        RUN.goExternalUrl(obj.url);
      }
      store.commit('loadingStore', {
        tag: false,
        text: '加载中....'
      });
      return;
    }
  }
  store.commit('loadingStore', {
    tag: false,
    text: '加载中....'
  });
  // modal.msgWarning(`“${obj.moduleName}”模块未分配您任何菜单权限，请联系管理员为您分配。`);
  store.commit('SET_module', null);
}

export default {
  screenListen,
  checkWindowRatio,
  initSkin,
  getImageUrl,
  picError,
  itemClick,
};
