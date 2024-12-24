import {getRouters} from '@/api/common/module'
import router from '@/router'
import store from '@/store/index';
import { LJSbase, LJSmenu } from 'ljs-tools';
const modules = import.meta.webpackContext('@/views', {
  // 是否搜索子目录
  recursive: true,
  regExp: /\.vue$/,
});
const permission = {
  actions: {
    // 生成路由
    GenerateRoutes({ commit }, params) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters({
          moduleId: params.moduleId
        }).then(res => {
          if (!LJSbase.fieldCheck(res) && !LJSbase.fieldCheck(res.data) && res.data.length > 0) {

            notAdminMenu(res);
            routerAndMenuChange(commit, res);
            
          }
          resolve(res);
        })
      })
    }
  }
}

export default permission;

// 菜单和路由处理办法
// commit: store commit
// res: 接口返回的数据
export function routerAndMenuChange(commit, res) {
  // 重组为可用菜单数据
  const kyRouter = [];
  res.data.forEach((ky) => {
    // 是否隐藏 - 顶级菜单 - 路由处理
    if (ky.hidden) return;
    if (ky.meta && ky.path !== '/') {
      kyRouter.push(ky);
    } else {
      ky.children.forEach((kyC) => {
        // kyC.path = ky.path + kyC.path;
        kyRouter.push(kyC);
      });
    }
  });
  // 接口数据处理 - 路由
  const interfaceData = routerDataChange(modules, kyRouter, []);
  // return;
  commit('SET_routerList', interfaceData);
  interfaceData.forEach((r) => {
    router.addRoute('frame', r);
  });
  // 接口数据处理 - 菜单
  let useMenu = [];
  // 重组为可用菜单数据
  const kyMenu = [];
  res.data.forEach((ky) => {
    // 是否隐藏 - 顶级菜单 - 菜单处理
    if (ky.hidden) return;
    if (ky.meta && ky.path !== '/') {
      kyMenu.push(ky);
    } else {
      ky.children.forEach((kyC) => {
        kyC.path = ky.path + kyC.path;
        kyMenu.push(kyC);
      });
    }
  });
  useMenu = useMenu.concat(kyMenu);
  const menuList = menuListChange(useMenu, 1);

  // 恢复展开状态。保留用户刷新前最后的菜单操作状态。
  const oldMenuList = store.getters.menuList;
  const menuId = findOpen(oldMenuList);
  if (!LJSbase.fieldCheck(menuId)) {
    const parents = LJSbase.getTreeParents({
      data: menuList,
      value: menuId,
      key: 'menuId'
    });
    if (parents.length > 0) {
      LJSmenu.updateTreeOpen(menuList, parents);
    }
  }

  store.commit('SET_menuList', menuList);
}

function findOpen(menuList) {
  const nums = menuList.length;
  for (let i = 0; i < nums; i++) {
    const item = menuList[i];
    if (item.open === true) {
      if (!LJSbase.fieldCheck(item.children) && item.children.length > 0) {
        const menuId = findOpen(item.children);
        if (!LJSbase.fieldCheck(menuId)) {
          return menuId;
        }
      }
      return item.menuId;
    }
  }
  return null;
}

// 处理路由数据
// modules: 获取可匹配的vue注入数据
// router: 接口返回的菜单数据
// menu: 将要返回的处理后的菜单数据
// keepAlive: 是否需要活性页面(暂未与接口数据对接)
// routerPath: 处理可点击菜单的真实path
export function routerDataChange(modules, router, menu, keepAlive = false, routerPath = '') {
  router.forEach((r) => {
    if (r.children && r.children.length > 0) {
      let tempPath = '';
      if (routerPath !== '') {
        tempPath = routerPath + '/' + r.path;
      } else {
        tempPath = r.path;
      }
      menu = routerDataChange(modules, r.children, menu, keepAlive, tempPath);
    } else {
      const modulePath = store.getters.module.url;
      menu.push({
        path: modulePath + routerPath + '/' + r.path,
        name: r.name,
        meta: {
          title: r.meta.title,
          icon: r.meta.icon,
          keepAlive: !r.meta.noCache // 解析是否缓存
        },
        component: loadView(modules, r.component)
        // component: modules[`/src/views/${r.component}`]
      });
    }
  });
  return menu;
}

export function loadView(modules, view) {
  for (const path of modules.keys()) {
    const mod = modules(path);
    if (path.indexOf(view) > -1) {
      return mod.default
    }
  }
}


/**
 * 获取菜单 - 处理菜单路由数据为可读数据
 * 路由处使用
 * @param {String} list 原始数据
 * @param {String} level 层级
 * @param {String} routerPath 处理可点击菜单路由地址
 * @param {Number} menuId 内置唯一标识
 * @returns {Array} 可识别的菜单数据
 * @example 内部使用，未对外开放。
 */
export function menuListChange(list, level, routerPath = '', menuId = 0) {
  const menuIdStep = 1000;
  const menuList = [];
  const modulePath = store.getters.module.url;
  list.forEach((item) => {
    // 是否隐藏
    if (!item.hidden) {
      menuId++;
      const temp = {
        menuId,
        title: item.meta.title, // 菜单名称
        icon: item.meta.icon, // 菜单图标
        name: item.name, // path名称
        url: item.path ? item.path : null, // 跳转地址
        open: false, // 是否展开子菜单
        choose: false, // 是否选中菜单
        level: level, // 层级
        children: [] // 子菜单数据集
      };
      let tempPath = '';
      if (routerPath !== '') {
        tempPath = routerPath + '/' + temp.url;
      } else {
        tempPath = temp.url;
      }
      if (item.children && item.children.length > 0) {
        temp.children = menuListChange(item.children, level + 1, tempPath, menuId * menuIdStep);
      } else {
        temp.url = modulePath + tempPath;
      }
      menuList.push(temp);
    }
  });
  return menuList;
}

// 超管以外用户不可见菜单
export function notAdminMenu(res) {
  const notShows = [];
  // const notShows = ['cacheList'];
  if (!res.data) {
    return;
  }
  const userinfo = store.getters.userinfo;
  if (userinfo.userId !== 1 && userinfo.userName !== 'admin') {
    notShows.forEach((path) => {
      notAdminMenuChange(path, res.data);
    });
  }
}
// 超管以外用户不可见菜单处理方法
export function notAdminMenuChange(path, list) {
  const nums = list.length;
  for (let i = 0; i < nums; i++) {
    const item = list[i];
    if (item.path === path) {
      list.splice(i, 1);
      return;
    }
    if (item.children !== undefined && item.children.length !== 0) {
      notAdminMenuChange(path, item.children);
    }
  }
}