/** 
 * @module base
 * @description 基础常用处理方法
 *  */
import store from '@/store/index.js';
import { LJSbase, LJSsession } from 'ljs-tools';


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
  *  @param {string} img import的图片
  *  @example this.$base.picError({form, key: 'imgPath', img: 'path'})
  * */
export async function picError({form, key = 'src', img}) {
  if (LJSbase.fieldCheck(img)) {
    img = new URL('@/assets/images/common/errorImg.png', import.meta.url).href;
    form[key] = img;
  }
}

export default {
  screenListen,
  checkWindowRatio,
  initSkin,
  getImageUrl,
  picError,
};

