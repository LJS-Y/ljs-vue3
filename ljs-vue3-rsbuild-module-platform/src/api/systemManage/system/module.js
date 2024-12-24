import { get, put, post, del } from '@/api/axios.js';

// 列表
export function list(query) {
  return get('/system/module/list', query);
}

// 列表 - 无分页
export function listNo(query) {
  return get('/system/module/subList', query);
}

// 详情
export function info(id) {
  return get('/system/module/' + id);
}

// 删除
export function listDel(id) {
  return del('/system/module/' + id);
}

// 新增
export function listAdd(query) {
  return post('/system/module', query);
}

// 修改
export function listEdit(query) {
  return put('/system/module', query);
}
