import { get, put, post, del } from '@/api/axios.js';

// 列表
export function list(query) {
  return get('/base/baseDevice/list', query);
}

// 详情
export function info(id) {
  return get('/base/baseDevice/' + id);
}

// 删除
export function listDel(id) {
  return del('/base/baseDevice/' + id);
}

// 新增
export function listAdd(query) {
  return post('/base/baseDevice', query);
}

// 修改
export function listEdit(query) {
  return put('/base/baseDevice', query);
}
