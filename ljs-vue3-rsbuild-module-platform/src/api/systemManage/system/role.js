import { get, put, post, del } from '@/api/axios.js';

// 查询角色列表
export function listRole(query) {
  return get('/system/role/list', query);
}

// 查询角色详细
export function getRole(roleId) {
  return get('/system/role/' + roleId);
}

// 新增角色
export function addRole(data) {
  return post('/system/role', data);
}

// 修改角色
export function updateRole(data) {
  return put('/system/role', data);
}

// 角色数据权限
export function dataScope(data) {
  return put('/system/role/dataScope', data);
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return put('/system/role/changeStatus', data);
}

// 删除角色
export function delRole(roleId) {
  return del('/system/role/' + roleId);
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return get('/system/role/authUser/allocatedList', query);
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return get('/system/role/authUser/unallocatedList', query);
}

// 取消用户授权角色
export function authUserCancel(data) {
  return put('/system/role/authUser/cancel', data);
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
  return put('/system/role/authUser/cancelAll', data, true);
}

// 授权用户选择
export function authUserSelectAll(data) {
  return put('/system/role/authUser/selectAll', data, true);
}

// 根据角色ID查询组织机构树结构
export function deptTreeSelect(roleId) {
  return get('/system/role/deptTree/' + roleId);
}
