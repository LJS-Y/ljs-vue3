export default {
  SET_token(state, token) {
    state.token = token;
  },
  SET_submitDDTag(state, submitDDTag) {
    state.submitDDTag = submitDDTag;
  },
  SET_userinfo(state, userinfo) {
    state.userinfo = userinfo;
  },
  SET_menuList(state, menuList) {
    state.menuList = menuList;
  },
  SET_permissions(state, permissions) {
    state.permissions = permissions;
  },
  SET_roles(state, roles) {
    state.roles = roles;
  },
	
	// 清空
	// this.$store.commit('RESET_STORE');
	RESET_STORE: (state) => {
		state.token = null;
		state.submitDDTag = false;
		state.userinfo = null;
		state.menuList = [];
		state.permissions = [];
		state.roles = [];
		uni.removeStorageSync('ljs_uniapp_token');
	},
};
