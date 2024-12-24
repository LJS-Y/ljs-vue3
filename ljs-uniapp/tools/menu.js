
/**
 * 更具获取的菜单数据处理小程序需要的菜单数据
 * @param {string} list 菜单数据
 * @example getMenu(menus);
 */
export function getMenu() {
	const menus = [
		{
			title: '首页',
			url: '/pages/index/index',
			icon: require('../static/images/menu/index.png'),
			iconActive: require('../static/images/menu/index_active.png'),
		},
		{
			title: '扫码',
			icon: require('../static/images/menu/sm.png'),
			type: 0,
		},
		{
			title: '我的',
			url: '/pages/mine/index',
			icon: require('../static/images/menu/my.png'),
			iconActive: require('../static/images/menu/my_active.png'),
		},
	];
	return menus;
}