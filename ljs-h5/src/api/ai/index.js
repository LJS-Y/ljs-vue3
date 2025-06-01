import { get, post } from '@/api/axios.js';

// 猜你想问
export function youLike(params) {
  return post('/ai/createQuestionGuide', params, false, 1000 * 60);
}