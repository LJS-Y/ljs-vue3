import { get, put, post, del } from '@/api/axios.js';

// 查询岗位列表
export function listPost(query) {
  return get('/system/post/list', query);
}

// 查询岗位详细
export function getPost(postId) {
  return get('/system/post/' + postId);
}

// 新增岗位
export function addPost(data) {
  return post('/system/post/', data);
}

// 修改岗位
export function updatePost(data) {
  return put('/system/post/', data);
}

// 删除岗位
export function delPost(postId) {
  return del('/system/post/' + postId);
}
