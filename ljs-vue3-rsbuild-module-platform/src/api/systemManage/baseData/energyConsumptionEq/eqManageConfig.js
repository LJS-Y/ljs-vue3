import { get, put, post, del } from '@/api/axios.js';

// 详情
export function info(id) {
  return get('/base/baseDeviceProperty/' + id);
}

// 保存
export function saveGx(query) {
  return post('/base/baseDeviceProperty', query);
}

// 历史数据
export function history(query) {
  return get('/base/baseDeviceProperty/data/history', query);
}

// 数据补录
export function handData(query) {
  return post('/energy/dataHistory/handData', query);
}
