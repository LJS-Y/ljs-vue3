import { get, put, post, del } from '@/api/axios.js';

// 查询部门列表
export function listDept(params) {
  return get('/system/dept/list', params);
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return get('/system/dept/list/exclude/' + deptId);
}

// 查询部门详细
export function getDept(deptId) {
  return get('/system/dept/' + deptId);
}

// 新增部门
export function addDept(data) {
  return post('/system/dept', data);
}

// 修改部门
export function updateDept(data) {
  return put('/system/dept', data);
}

// 删除部门
export function delDept(deptId) {
  return del('/system/dept/' + deptId);
}