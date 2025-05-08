import { get } from '@/uni_modules/ljs-sdk-public/js_sdk/utils/request/index.js';

const api = {
  // 获取验证码
  getCodeImg: () => {
    return get('/captchaImage');
  },
};

export default api;