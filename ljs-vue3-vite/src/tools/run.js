/** 
 * @module session
 * @description 路由跳转，分装所有页面跳转的方法
 *  */
import router from '../router';

/**
 * router.push
 * @param {string} parms 参数
 * @example this.$run.push({
          path: '/organizationAdd'
        })
 *  */
export function push(parms) {
  router.push(parms);
}

/**
 * router.replace
 * @param {string} parms 参数
 * @example this.$run.replace({
          path: '/organizationAdd'
        })
 *  */
export function replace(parms) {
  router.replace(parms);
}

/**
 * router.push
 * @param {string} index 回退的页数，默认一页
 * @example this.$run.go(-1)
 *  */
export function go(index = -1) {
  router.go(index);
}

/**
 * 跳外部地址
 * @param {string} url 外部地址
 * @param {string} method 跳转方法，_self当前页，_blank新页签
 * @example this.$run.goExternalUrl(url)
 *  */
export function goExternalUrl(url, method = '_blank') {
  window.open(url, method);
}

export default {
  push,
  replace,
  go,
  goExternalUrl
};
