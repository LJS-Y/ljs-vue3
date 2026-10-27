import { get, put, post, del } from '@/api/axios.js';
import store from '@/store/index.js';

export function login(params) {
  store.commit('SET_token', null);
  return post('/login', params);
}

export function getInfo(params) {
  return get('/getInfo', params);
}

// 获取验证码
export function getCodeImg() {
  return get('/captchaImage');
}
