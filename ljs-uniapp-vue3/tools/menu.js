import index from '@/static/images/menu/index.png';
import index_active from '@/static/images/menu/index_active.png';
import sm from '@/static/images/menu/sm.png';
import my from '@/static/images/menu/my.png';
import my_active from '@/static/images/menu/my_active.png';
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
			icon: index,
			iconActive: index_active,
		},
		{
			title: '扫码',
			icon: sm,
			type: 0,
		},
		{
			title: '我的',
			url: '/pages/mine/index',
			icon: my,
			iconActive: my_active,
		},
	];
	return menus;
}