/** 
 * @module apiQueryChange
 * @description API请求参数处理
 *  */
import { LJSbase } from 'ljs-tools';
import store from '@/store/index.js';

/**
 * API请求 - 防抖动，是否可以继续请求
 * @param {String} url 请求地址
 * @param {Array} query 参数
 * @example 
  // 根据请求url和参数，进行抖动熔断
  let apiShake = true;
  apiShake = apiQC.preventShake(url, JSON.stringify(params));
 */
export function preventShake(url, query) {
  const timeCHA = 300; // 差值
  const apiShake = store.state.apiShake; // 存储中的数据
  const apiShakeUse = []; // 可用
  let apiShakeTag = true; // 状态
  const api = {
    url,
    query,
    time: new Date().getTime()
  };
  if (apiShake.length === 0) {
    apiShakeUse.push(api);
  } else {
    const nums = apiShake.length;
    const nowTime = new Date().getTime();
    for (let i = 0; i < nums; i++) {
      const item = apiShake[i];
      const timeC = (nowTime - item.time);
      if (item.url === api.url && item.query === api.query) {
        if (timeC <= timeCHA) {
          apiShakeTag = false;
          continue;
        }
      }
      if (timeC <= timeCHA) {
        apiShakeUse.push(item);
      }
      if (i === nums - 1) {
        apiShakeUse.push(api);
      }
    }
  }
  store.commit('SET_apiShake', apiShakeUse);
  return apiShakeTag;
}

/**
 * API请求 - 日期区间参数处理。
 * @param {String} query 请求参数
 * @param {Array} keys 转换参数，默认['beginTimeDate', 'endTimeDate']
 * @example const queryReal = this.$apiQC.dateRange(this.tableSearch.queryReal);
 */
export function dateRange(query, keys = ['beginTimeDate', 'endTimeDate']) {
  const queryReal = LJSbase.deepCopy(query);
  if (queryReal.date && queryReal.date !== null) {
    queryReal[keys[0]] = queryReal.date[0];
    queryReal[keys[1]] = queryReal.date[1];
    delete queryReal.date;
  }
  return queryReal;
}

/**
 * API请求 - FileUpload组件获取的文件数据处理。
 * @param {String} list 组件获取的原始数据
 * @param {String} fileName 名称key
 * @param {String} fileUrl 相对地址key
 * @example query.dzsmsList = this.$apiQC.fileUploadQueryChange(query.dzsmsList);
 */
export function fileUploadQueryChange(list, fileName = {
  old: 'name', // 来源
  new: 'fileName', // 期待变更为
}, fileUrl = {
  old: 'url', // 来源
  new: 'fileUrl', // 期待变更为
}) {
  const fileList = [];
  list.forEach((item) => {
    const temp = {};
    temp[fileName.new] = item[fileName.old];
    temp[fileUrl.new] = item[fileUrl.old];
    fileList.push(temp);
  });
  return fileList;
}

export default {
  preventShake,
  dateRange,
  fileUploadQueryChange,
};
