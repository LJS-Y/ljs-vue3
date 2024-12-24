export default {
  token: state => {
    return state.token;
  },
  userinfo: state => {
    return state.userinfo;
  },
  modules: state => {
    return state.modules;
  },
  module: state => {
    return state.module;
  },
  permissions: state => {
    return state.permissions;
  },
  roles: state => {
    return state.roles;
  },
  menuChoose: state => {
    return state.menuChoose;
  },
  routerList: state => {
    return state.routerList;
  },
  menuList: state => {
    return state.menuList;
  },
  menuOpenList: state => {
    return state.menuOpenList;
  },
  menuNowOpen: state => {
    return state.menuNowOpen;
  },
  menuShrink: state => {
    return state.menuShrink;
  },
  screenWidth: state => {
    return state.screenWidth;
  },
  frameTheme: state => {
    return state.frameTheme;
  }
};
