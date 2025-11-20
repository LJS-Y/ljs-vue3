/** 
 * @module base
 * @description 基础常用处理方法
 *  */
import store from '@/store/index.js';
import $em from '@/tools/errorImages.js';
import { LJSbase, LJSsession, LJSEl } from 'ljs-tools';


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
 * 监听页面可见性变化的事件
 * @example 
App.vue调用：
this.$base.visibilitychangeListen(); 
 */
export function visibilitychangeListen () {
  document.addEventListener('visibilitychange', async () => {
    const buildTime = await getHtmlBuildTime();
    if (buildTime === BUILD_TIME) {
      return;
    }
    const ljs_visibilitychange_message = LJSsession.getSS('ljs_visibilitychange_message');
    if (ljs_visibilitychange_message === '1') {
      return;
    }
    LJSsession.setSS('ljs_visibilitychange_message', '1');
    LJSEl.delMessageBox({
      type: 'success',
      title: '系统提示',
      message: `检测到系统有新版本发布，是否立即更新？`,
      confirmButtonText: '现在更新',
      draggable: true,
      doSomething: () => {
        window.location.href = window.location.href + '?_=' + Date.now();
        LJSsession.delSS('ljs_visibilitychange_message');
      },
      cancelDoSomething: () => {
        LJSsession.delSS('ljs_visibilitychange_message');
      }
    });
  });
}
async function getHtmlBuildTime() {
  const baseURL = import.meta.env.BASE_URL;
  const res = await fetch(`${baseURL}index.html`);
  const html = await res.text();
  const match = html.match(/<meta name="build-time" content="(.*)">/);
  const buildTime = match?.[1] || '';
  return buildTime;
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
  *  默认图片
  *  @param {object} form 表单对象
  *  @param {string} key 键名不叫phone时需要传入新的键名
  *  @param {Object} img import的图片
  *  @example this.$base.picError({form, key: 'imgPath', img: $em.errorImage_def})
  * */
export function picError({form, key = 'src', img = $em.errorImage_def}) {
  form[key] = img;
}

/**
 * 时间控制器
 * @param time 需要控制的时间长度，毫秒。
 * @example this.$base.timeControl(); // 配置blue为默认
 */
export function timeControl(time = 300) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

export default {
  screenListen,
  visibilitychangeListen,
  checkWindowRatio,
  initSkin,
  picError,
  timeControl,
};

