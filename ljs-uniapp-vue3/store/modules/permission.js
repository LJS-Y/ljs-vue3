import APImodule from '@/request/common/module';
import store from '@/store/index';
const permission = {
  actions: {
    // 生成路由
    GenerateRoutes({ commit }, params) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        APImodule.getRouters({
          moduleId: params.moduleId
        }).then(res => {
					let list = [];
          if (res.data !== undefined && res.data.length > 0) {
						const moduleIndex = 0;
            // notAdminMenu(res);
            list = routerAndMenuChange(commit, res, params.moduleIndex);
          }
          resolve(list);
        })
      })
    }
  }
}

export default permission;

// 菜单和路由处理办法
// commit: store commit
// res: 接口返回的数据
export function routerAndMenuChange(commit, res, moduleIndex) {
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
  const menuList = menuListChange(useMenu, 1, moduleIndex);
	return menuList;
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
export function menuListChange(list, level, moduleIndex, routerPath = '', menuId = 0) {
  const menuIdStep = 1000;
  const menuList = [];
  const modulePath = store.getters.module[moduleIndex].url;
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
        temp.children = menuListChange(item.children, level + 1, moduleIndex, tempPath, menuId * menuIdStep);
      } else {
        temp.url = modulePath + tempPath;
      }
      menuList.push(temp);
    }
  });
  return menuList;
}