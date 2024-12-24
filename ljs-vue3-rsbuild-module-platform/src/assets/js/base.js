import { LJSbase, LJSsession } from 'ljs-tools';
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

/**
 * 内置角色：admin可改，其他不可改
 * @param {String} roleKey 角色的key
 * @example $comB.builtInRoles()
>
 */
export function builtInRoles(roleKey) {
  if (LJSbase.fieldCheck(roleKey)) {
    return true;
  }
  const roles = [
    // 仓库
    'warehouse_manager', 'scrap_manager', 'checkInventory_manager', 
    // 维保平台
    'maintain_manager', 'maintain_worker', 'inspection_manager', 'inspection_group', 'spotcheck_manager', 'spotcheck_worker', 'defect_manager', 'defect_worker', 
    // 变频器
    'abb_maintainer',
  ];
  if (roles.includes(roleKey) && !LJSbase.fieldCheck(store.getters.userinfo)) {
    return store.getters.userinfo.userId === 1;
  }
  return true;
}

export default {
  closeWindow,
  tableRowClassName,
  builtInRoles,
};
