import { get } from '@/api/axios.js';

// 获取路由数据
export function getRouters(params) {
  return get('/getRouters', params);
}
