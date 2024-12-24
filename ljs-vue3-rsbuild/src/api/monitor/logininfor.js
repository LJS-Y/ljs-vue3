import { get, put, post, del } from '@/api/axios.js';

// 查询登录日志列表
export function list(query) {
  return get('/monitor/logininfor/list', query);
}

// 删除登录日志
export function delLogininfor(infoId) {
  return del('/monitor/logininfor/' + infoId);
}

// 解锁用户登录状态
export function unlockLogininfor(userName) {
  return get('/monitor/logininfor/unlock/' + userName);
}

// 清空登录日志
export function cleanLogininfor() {
  return del('/monitor/logininfor/clean');
}
