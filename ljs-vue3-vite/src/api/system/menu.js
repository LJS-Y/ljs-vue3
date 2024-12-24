import { get, put, post, del } from '@/api/axios.js';

// 查询菜单列表
export function listMenu(params) {
  return get('/system/menu/list', params);
}

// 查询菜单详细
export function getMenu(menuId) {
  return get('/system/menu/' + menuId);
}

// 查询菜单下拉树结构
export function treeselect() {
  return get('/system/menu/treeselect');
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return get('/system/menu/roleMenuTreeselect/' + roleId);
}

// 新增菜单
export function addMenu(data) {
  return post('/system/menu', data);
}

// 修改菜单
export function updateMenu(data) {
  return put('/system/menu', data);
}

// 删除菜单
export function delMenu(menuId) {
  return del('/system/menu/' + menuId);
}