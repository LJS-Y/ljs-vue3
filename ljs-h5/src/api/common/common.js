import { get, put, post, del } from '@/api/axios.js';

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return get('/system/dict/data/type/' + dictType);
}