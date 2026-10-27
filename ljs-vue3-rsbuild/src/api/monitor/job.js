import { get, put, post, del } from '@/api/axios.js';

// 查询定时任务调度列表
export function listJob(query) {
  return get('/monitor/job/list', query);
}

// 查询定时任务调度详细
export function getJob(jobId) {
  return get('/monitor/job/' + jobId);
}

// 新增定时任务调度
export function addJob(data) {
  return post('/monitor/job', data);
}

// 修改定时任务调度
export function updateJob(data) {
  return put('/monitor/job', data);
}

// 删除定时任务调度
export function delJob(jobId) {
  return del('/monitor/job/' + jobId);
}

// 任务状态修改
export function changeJobStatus(jobId, status) {
  const data = {
    jobId,
    status
  }
  return put('/monitor/job/changeStatus', data);
}

// 定时任务立即执行一次
export function runJob(jobId, jobGroup) {
  const data = {
    jobId,
    jobGroup
  }
  return put('/monitor/job/run', data);
}