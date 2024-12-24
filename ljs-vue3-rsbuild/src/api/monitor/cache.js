import { get, put, post, del } from '@/api/axios.js';

// 查询缓存详细
export function getCache() {
  return get('/monitor/cache');
}

// 查询缓存名称列表
export function listCacheName() {
  return get('/monitor/cache/getNames');
}

// 查询缓存键名列表
export function listCacheKey(cacheName) {
  return get('/monitor/cache/getKeys/' + cacheName);
}

// 查询缓存内容
export function getCacheValue(cacheName, cacheKey) {
  return get('/monitor/cache/getValue/' + cacheName + '/' + cacheKey);
}

// 清理指定名称缓存
export function clearCacheName(cacheName) {
  return del('/monitor/cache/clearCacheName/' + cacheName);
}

// 清理指定键名缓存
export function clearCacheKey(cacheKey) {
  return del('/monitor/cache/clearCacheKey/' + cacheKey);
}

// 清理全部缓存
export function clearCacheAll() {
  return del('/monitor/cache/clearCacheAll');
}
