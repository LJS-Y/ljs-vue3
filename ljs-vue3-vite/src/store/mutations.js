export default {
  openSubmitDDTag(_state, tag) {
    _state.submitDDTag = tag;
  },
  loadingStore(_state, tag) {
    _state.loading = tag;
  },

  SET_token(_state, token) {
    _state.token = token;
  },
  SET_userinfo(_state, userinfo) {
    _state.userinfo = userinfo;
  },
  SET_apiShake(_state, apiShake) {
    _state.apiShake = apiShake;
  },
  SET_permissions(_state, permissions) {
    _state.permissions = permissions;
  },
  SET_roles(_state, roles) {
    _state.roles = roles;
  },
  SET_routerList(_state, routerList) {
    _state.routerList = routerList;
  },
  SET_menuList(_state, menuList) {
    _state.menuList = menuList;
  },
  SET_menuOpenList(_state, menuOpenList) {
    _state.menuOpenList = menuOpenList;
  },
  SET_menuNowOpen(_state, menuNowOpen) {
    _state.menuNowOpen = menuNowOpen;
  },
  SET_menuShrink(_state, menuShrink) {
    _state.menuShrink = menuShrink;
  },
  SET_screenWidth(_state, screenWidth) {
    _state.screenWidth = screenWidth;
  },
  SET_frameTheme(_state, frameTheme) {
    _state.frameTheme = frameTheme;
  },
  // axios 全部取消
  // addCancelToken(state, cancel) {
  //   if (!state.cancelTokenArr) {
  //     state.cancelTokenArr = [];
  //   }
  //   if (cancel) {
  //     state.cancelTokenArr.push(cancel);
  //   }
  // },
  // 取消所有请求
  // clearCancelToken(state) {
  //   console.log(state.cancelTokenArr);
  //   state.cancelTokenArr.forEach(c => {
  //     if (c) {
  //       c();
  //     }
  //   });
  //   state.cancelTokenArr = [];
  // }
};
