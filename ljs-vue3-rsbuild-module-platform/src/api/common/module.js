import { get } from '@/api/axios.js';

// 获取角色、权限串
export function getPermissionsInfo(params) {
  return get('/getPermissionsInfo', params);
}

// 获取路由数据
export function getRouters(params) {
  return get('/getRouters', params);
}
