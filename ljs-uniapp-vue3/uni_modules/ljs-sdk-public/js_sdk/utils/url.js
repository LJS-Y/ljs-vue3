/**
 * @module num
 * @description url封装
 *  */
/** @module URL检测与应用 */

import BASE from './base'

/**
 * 解析地址中所有的参数值，并返回一个对象
 * @param {String} key key
 * @returns {String} 返回指定key的参数值，如不存在返回null。
 * @example this.$LJSurl.getUrlAllParameter(url)
 */
export function getUrlAllParameter(url) {
  if (BASE.fieldCheck(url)) {
    console.warn(`传入参数不存在或不存在任何参数，请检查。`)
    return null
  }
  const result = {}
  let parameters = url.split('?')
  if (parameters.length === 1) {
    return [parameters[0], result]
  }
  const ps = parameters[1].split('&')
  const nums = ps.length
  for (let i = 0; i < nums; i++) {
    const query = ps[i].split('=')
    result[query[0]] = query[1]
  }
  return [parameters[0], result]
}

/**
 * 获取地址中的指定参数的值
 * @param {String} key key
 * @param {String} url 请求地址
 * @returns {String} 返回指定key的参数值，如不存在返回null。
 * @example this.$LJSurl.getUrlParameter('moduleName');
 */
export function getUrlParameter(key, url = location.search) {
  const urlAllParameter = getUrlAllParameter(url)
  if (urlAllParameter === null) {
    return null
  }
  const parameter = urlAllParameter[1]
  if (key in parameter) {
    return parameter[key]
  }
  return null
}

/**
 * 获取文件类型
 * @param {String} str 含有文件类型的名称串
 * @param {Boolean} showDot 是否包含点（如 .pdf）
 * @returns {String} 返回文件类型的字符串。
 * @example this.$LJSurl.getFileType(url);
 */
export function getFileType(str, showDot = true) {
  if (BASE.fieldCheck(str)) {
    console.warn(`传入参数不存在，请检查参数值。`)
    return null
  }
  let lastIndex = str.lastIndexOf('.')
  if (lastIndex === -1) {
    console.warn(`传入参数不是合法的文件名字符串，请检查参数值。`)
    return null
  }
  lastIndex = showDot ? lastIndex : lastIndex + 1
  return str.slice(lastIndex, str.length)
}

/**
 * 获取文件名称
 * @param {String} str 含有文件名称的地址字符串
 * @param {Boolean} showSuffix 是否包含后缀（如 .pdf），默认不包含
 * @returns {String} 返回文件类型的字符串。
 * @example this.$LJSurl.getFileName(url);
 */
export function getFileName(str, showSuffix = false) {
  if (BASE.fieldCheck(str)) {
    console.warn(`传入参数不存在，请检查参数值。`)
    return null
  }
  const index1 = str.lastIndexOf('/')
  const index2 = str.lastIndexOf('\\')
  let lastIndex = index1 > index2 ? index1 : index2
  if (lastIndex !== -1) {
    lastIndex++
  } else {
    lastIndex = 0
  }
  if (showSuffix) {
    return str.slice(lastIndex, str.length)
  } else {
    if (str.lastIndexOf('.') > -1) {
      return str.slice(lastIndex, str.lastIndexOf('.'))
    } else {
      return str.slice(lastIndex, str.length)
    }
  }
}

/**
 * ipv4校验
 * @param {String} ip document.domain，当前网站的地址
 * @returns {Boolean} 是否为IPV4
 * @example this.$LJSurl.isIPV4ValidIP(document.domain)
 * */
export function isIPV4ValidIP(ip) {
  var v4reg =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return v4reg.test(ip)
}

/**
 * ipv6校验
 * @param {String} ip document.domain，当前网站的地址
 * @returns {Boolean} 是否为IPV6
 * @example this.$LJSurl.isIPV6ValidIP(document.domain)
 * */
export function isIPV6ValidIP(ip) {
  var v6reg =
    /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/gm
  return v6reg.test(ip)
}

/**
 * ip校验
 * @param {String} ip document.domain，当前网站的地址
 * @returns {Boolean} 是否为IP地址
 * @example this.$LJSurl.isIPValid(document.domain);
 * */
export function isIPValid(ip) {
  return isIPV6ValidIP(ip) || isIPV4ValidIP(ip)
}

export default {
  getUrlAllParameter,
  getUrlParameter,
  getFileType,
  getFileName,
  isIPV4ValidIP,
  isIPV6ValidIP,
  isIPValid,
}
