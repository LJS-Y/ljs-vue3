import { get, put, post, del } from '@/api/axios.js';
import { LJSbase } from "ljs-tools";

// 查询用户列表
export function listUser(params) {
  return get('/system/user/list', params);
}

// 查询用户详细
export function getUser(userId) {
  const id = LJSbase.fieldCheck(userId) ? '' : userId;
  return get('/system/user/' + id);
}

// 新增用户
export function addUser(data) {
  return post('/system/user/', data);
}

// 修改用户
export function updateUser(data) {
  return put('/system/user/', data);
}

// 删除用户
export function delUser(userId) {
  return del('/system/user/' + userId);
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return put('/system/user/resetPwd', data);
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return put('/system/user/changeStatus', data);
}

// 查询用户个人信息
export function getUserProfile() {
  return get('/system/user/profile');
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return put('/system/user/profile', data);
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  return put(`/system/user/profile/updatePwd?oldPassword=${oldPassword}&newPassword=${newPassword}`);
}

// 用户头像上传
export function uploadAvatar(data) {
  return post('/system/user/profile/avatar', data, true);
}

// 查询授权角色
export function getAuthRole(userId) {
  return get('/system/user/authRole/' + userId);
}

// 保存授权角色
export function updateAuthRole(data) {
  return put('/system/user/authRole', data);
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return get('/system/user/deptTree');
}
