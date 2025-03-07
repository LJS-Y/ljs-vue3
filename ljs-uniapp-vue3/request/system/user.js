import { get, put, post, uploadFile } from '@/uni_modules/ljs-sdk-public/js_sdk/utils/request/index.js';

const api = {
  // 用户密码重置
  updateUserPwd: (oldPassword, newPassword) => {
    return put(`/system/user/profile/updatePwd?oldPassword=${oldPassword}&newPassword=${newPassword}`);
  },
  // 查询用户个人信息
  getUserProfile: (params) => {
    return get('/system/user/profile', params);
  },
	// 修改用户个人信息
  updateUserProfile: (params) => {
    return put('/system/user/profile', params);
  },
	// 用户头像上传
  uploadAvatar: (file) => {
    return uploadFile('/system/user/profile/avatar', 'avatarfile', file);
  },
};

export default api;
