import { get } from '@/uni_modules/ljs-sdk/js_sdk/utils/request/index.js';

const api = {
	// 获取路由数据
  getRouters: (params) => {
		return get('/getRouters', params);
  },
	// 获取角色、权限串
  getPermissionsInfo: (params) => {
		return get('/getPermissionsInfo', params);
  }
};

export default api;
