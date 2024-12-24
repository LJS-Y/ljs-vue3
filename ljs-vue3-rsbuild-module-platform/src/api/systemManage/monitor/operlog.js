import { get, put, post, del } from '@/api/axios.js';

// 查询操作日志列表
export function list(query) {
  return get('/monitor/operlog/list', query);
}

// 删除操作日志
export function delOperlog(operId) {
  return del('/monitor/operlog/' + operId);
}

// 清空操作日志
export function cleanOperlog() {
  return del('/monitor/operlog/clean');
}
