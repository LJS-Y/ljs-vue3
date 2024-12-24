import { login, get, post, uploadFile } from '@/uni_modules/ljs-sdk-public/js_sdk/utils/request/index.js';

const api = {
  // 登录
  login: (params) => {
    return login('/login', params);
  },
  // getInfo
  getInfo: (params) => {
    return get('/getInfo', params);
  },
	// 字典
  getDicts: (dictType) => {
    return get('/system/dict/data/type/' + dictType);
  },
	// 上传
  uploadFile: (params) => {
    return uploadFile('/common/upload', params);
  }
};

export default api;