import { get, put, post, del } from '@/api/axios.js';

// 查询参数列表
export function listConfig(query) {
  return get('/system/config/list', params);
}

// 查询参数详细
export function getConfig(configId) {
  return get('/system/config/' + configId);
}

// 根据参数键名查询参数值
export function getConfigKey(configKey) {
  return get('/system/config/configKey/' + configKey);
}

// 新增参数配置
export function addConfig(data) {
  return post('/system/config', data);
}

// 修改参数配置
export function updateConfig(data) {
  return put('/system/config', data);
}

// 删除参数配置
export function delConfig(configId) {
  return del('/system/config/' + configId);
}

// 刷新参数缓存
export function refreshCache() {
  return del('/system/config/refreshCache');
}
