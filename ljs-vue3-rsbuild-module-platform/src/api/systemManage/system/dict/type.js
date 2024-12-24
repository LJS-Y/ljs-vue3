import { get, put, post, del } from '@/api/axios.js';

// 查询字典类型列表
export function listType(query) {
  return get('/system/dict/type/list', query);
}

// 查询字典类型详细
export function getType(dictId) {
  return get('/system/dict/type/' + dictId);
}

// 新增字典类型
export function addType(data) {
  return post('/system/dict/type/', data);
}

// 修改字典类型
export function updateType(data) {
  return put('/system/dict/type/', data);
}

// 删除字典类型
export function delType(dictId) {
  return del('/system/dict/type/' + dictId);
}

// 刷新字典缓存
export function refreshCache() {
  return del('/system/dict/type/refreshCache');
}

// 获取字典选择框列表
export function optionselect() {
  return get('/system/dict/type/optionselect');
}