import { LJSsession } from 'ljs-tools';
import store from '@/store';
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

/**
 * 隔行配置表格颜色class
 * @param {Object} row 行对象
 * @param {Number} rowIndex 行索引
 * @example 
 <el-table
  :row-class-name="$comB.tableRowClassName"
>
 */
export function tableRowClassName({row, rowIndex}) {
  if (rowIndex%2 === 1) {
    return 'row-blueBg';
  }
  return '';
}

export default {
  closeWindow,
  tableRowClassName,
};
