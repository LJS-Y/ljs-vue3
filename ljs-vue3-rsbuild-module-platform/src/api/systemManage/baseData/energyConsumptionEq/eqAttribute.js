import { get, put, post, del } from '@/api/axios.js';

// 列表
export function list(query) {
  return get('/deviceAttr/baseDeviceAttr/list', query);
}

// 树 - 属性
export function attrTree(query) {
  return get('/deviceAttr/baseDeviceAttr/subList', query);
}

// 详情
export function info(id) {
  return get('/deviceAttr/baseDeviceAttr/' + id);
}

// 删除
export function listDel(id) {
  return del('/deviceAttr/baseDeviceAttr/' + id);
}

// 新增
export function listAdd(query) {
  return post('/deviceAttr/baseDeviceAttr', query);
}

// 修改
export function listEdit(query) {
  return put('/deviceAttr/baseDeviceAttr', query);
}
