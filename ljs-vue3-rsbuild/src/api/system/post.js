import { get, put, post, del } from '@/api/axios.js';

// 列表
export function list(query) {
  return get('/system/post/list', query);
}

// 详情
export function info(id) {
  return get('/system/post/' + id);
}

// 删除
export function listDel(id) {
  return del('/system/post/' + id);
}

// 新增
export function listAdd(query) {
  return post('/system/post', query);
}

// 修改
export function listEdit(query) {
  return put('/system/post', query);
}
