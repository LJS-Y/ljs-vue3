import { get, put, post, del } from '@/api/axios.js';

// 查询调度日志列表
export function listJobLog(query) {
  return get('/monitor/jobLog/list', query);
}

// 删除调度日志
export function delJobLog(jobLogId) {
  return del('/monitor/jobLog/' + jobLogId);
}

// 清空调度日志
export function cleanJobLog() {
  return del('/monitor/jobLog/clean');
}
