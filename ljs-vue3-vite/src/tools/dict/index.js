import { getDicts } from '@/api/system/dict/data';

/**
 * 获取字典数据
 * @param {String} key sys_normal_disable，key
 * @example this.$dict.getDict(); 
 */
export async function getDict(key) {
  return new Promise(resolve => {
    // 向后端请求路由数据
    getDicts(key).then((res) => {
      if (res.code === 200) {
        resolve(res.data);
      }
    });
  })
}

export default {
  getDict
};
