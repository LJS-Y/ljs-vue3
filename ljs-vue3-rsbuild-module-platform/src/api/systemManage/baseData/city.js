import { get, put, post, del } from '@/api/axios.js';

// 列表
export function list(query) {
  return get('/sirui/region/list', query);
}

// 行政区划 - 树
export function cityTree(query) {
  return get('/sirui/region/list', query);
}

// 详情
export function info(id) {
  return get('/sirui/region/' + id);
}

// 删除
export function listDel(id) {
  return del('/sirui/region/' + id);
}

// 新增
export function listAdd(query) {
  return post('/sirui/region', query);
}

// 修改
export function listEdit(query) {
  return put('/sirui/region', query);
}
