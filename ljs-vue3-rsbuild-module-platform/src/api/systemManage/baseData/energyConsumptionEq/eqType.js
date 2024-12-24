import { get, put, post, del } from '@/api/axios.js';

// 列表
export function list(query) {
  return get('/base/baseDeviceType/list', query);
}

// 详情
export function info(id) {
  return get('/base/baseDeviceType/' + id);
}

// 删除
export function listDel(id) {
  return del('/base/baseDeviceType/' + id);
}

// 新增
export function listAdd(query) {
  return post('/base/baseDeviceType', query);
}

// 修改
export function listEdit(query) {
  return put('/base/baseDeviceType', query);
}
