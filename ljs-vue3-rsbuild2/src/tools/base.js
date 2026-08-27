/** 
 * @module base
 * @description 基础常用处理方法
 *  */
import store from '@/store/index.js';
import $em from '@/tools/errorImages.js';
import { LJSbase, LJSsession } from 'ljs-tools';
import $modal from '@/tools/ruoyi/modal';


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
  // 更新影响用户使用，先关闭
  // 弹窗层级问题影响。
  document.addEventListener('visibilitychange', async () => {
    const buildTime = await getHtmlBuildTime();
    if (buildTime === BUILD_TIME) {
      LJSsession.delSS('ljs_visibilitychange_message');
      return;
    }
    
    // 处理误操作多次弹出问题。
    const ljs_visibilitychange_message = LJSsession.getSS('ljs_visibilitychange_message');
    if (ljs_visibilitychange_message === 'v1') {
      return;
    }
    LJSsession.setSS('ljs_visibilitychange_message', 'v1');

    ElNotification({
      title: '系统更新提示',
      message: '检测到系统有新版本发布，当您空闲时点击浏览器刷新即可获得最新版！',
      showClose: true,
    })
  });
}
async function getHtmlBuildTime() {
  try {
    const baseURL = import.meta.env.BASE_URL;
    const res = await fetch(`${baseURL}index.html`);
    const html = await res.text();
    const match = html.match(/<meta name="build-time" content="(.*)">/);
    const buildTime = match?.[1] || '';
    return buildTime;
  } catch (error) {
    return '';
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

/**
 * 获取文件 - 需授权
 * @param {String} id 文件ID
 * @param {String} url 接口
 * @param {String} token 授权参数
 * @example this.$base.idForFile({ id: id });
 */
export function idForFile({
  id,
  url = '/api/file/download/',
  token = 'Authorization',
}) {
  if (!LJSbase.fieldCheck(id)) {
    return `${import.meta.env.PUBLIC_API_URL}${url}${id}?${token}=${store.getters.token}`
  }
  return null
}

/**
 * 获取文件 - 无需授权
 * @example this.$base.idForFileNo({ id: id });
 */
export function idForFileNo({
  id,
  url = '/api/file/unauthorized/download/',
}) {
  if (!LJSbase.fieldCheck(id)) {
    return `${import.meta.env.PUBLIC_API_URL}${url}${id}`
  }
  return null
}

/**
 * 复制方法
 * @param {String} text 待复制的内容
 * @return 新的模块数据
 * @example this.$base.fastCopy(text)
 */
export async function fastCopy(text = null) {
  if (LJSbase.fieldCheck(text)) {
    console.error('复制的内容不存在，请检查');
    return
  }
  try {
    // 复制到剪贴板
    await navigator.clipboard.writeText(text)
    $modal.msgSuccess(`复制成功`);
  } catch (err) {
    $modal.msgWarning(`复制失败，请手动复制`);
    console.error(err)
  }
}

/**
 *  多个请求，同时完成，做落地业务
 * @param {PromiseList} pList Promise数据集
 * @return 新的模块数据
 * @example
 * 
try {
  const apiList = [
    this.$dict.getDict('wine_activity_type'),
    this.$dict.getDict('wine_activity_jointype'),
  ]
  const results = await this.$base.PromiseAll(apiList)

  results.forEach((res, i) => {
    if (i === 0) {
      this.wine_activity_type = res;
      this.wine_activity_type_search = [
        {
          dictLabel: '全部',
          dictValue: ''
        },
        ...this.wine_activity_type,
      ];
    } else if (i === 1) {
      this.wine_activity_jointype = res;
      this.wine_activity_jointype_search = [
        {
          dictLabel: '全部',
          dictValue: ''
        },
        ...this.wine_activity_jointype,
      ];
    }
  })
} catch (e) {
  console.error(e);
  return
}
 * */
export function PromiseAll(pList = []) {
  return new Promise(function (resolve, reject) {
    if (!LJSbase.fieldCheck(pList) && pList.length > 0) {
      Promise.all(pList).then((res) => {
        resolve(res)
      }).catch((error) => {
        reject(error)
      })
    } else {
      reject({ code: 500, msg: 'pList null'})
    }
  })
}

export default {
  screenListen,
  visibilitychangeListen,
  checkWindowRatio,
  initSkin,
  picError,
  timeControl,
  idForFile,
  idForFileNo,
  fastCopy,
  PromiseAll,
};

