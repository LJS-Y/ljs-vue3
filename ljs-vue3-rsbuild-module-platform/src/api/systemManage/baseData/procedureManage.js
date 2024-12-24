import { get, put, post, del } from '@/api/axios.js';

// 工序 - 列表
export function processList(query) {
  return get('/srup/process/list', query);
}

// 工序 - 详情
export function processInfo(id) {
  return get('/srup/process/' + id);
}

// 工序 - 新增
export function processListAdd(query) {
  return post('/srup/process', query);
}

// 工序 - 修改
export function processListEdit(query) {
  return put('/srup/process', query);
}

// 工序 - 删除
export function processListDel(id) {
  return del('/srup/process/' + id);
}

// 工序单元 - 列表
export function processUnitList(query) {
  return get('/srup/unit/list', query);
}

// 工序单元 - 详情
export function processUnitInfo(id) {
  return get('/srup/unit/' + id);
}

// 工序单元 - 新增
export function processUnitListAdd(query) {
  return post('/srup/unit', query);
}

// 工序单元 - 修改
export function processUnitListEdit(query) {
  return put('/srup/unit', query);
}

// 工序单元 - 删除
export function processUnitListDel(id) {
  return del('/srup/unit/' + id);
}
