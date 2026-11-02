import { LJSsession } from 'ljs-tools';
import store from '@/store/index.js';
/** @module 项目公共方法 */

/**
 * 关闭浏览器窗口
 * @example this.$comB.closeWindow()
 */
export function closeWindow() {
  LJSsession.clearVuex(store);
  LJSsession.clearSS();
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf('Firefox') !== -1 || userAgent.indexOf('Chrome') !== -1) {
    window.location.replace('about:blank');
  } else {
    window.opener = null;
    window.open('', '_self');
  }
  window.close();
}

export default {
  closeWindow,
};
