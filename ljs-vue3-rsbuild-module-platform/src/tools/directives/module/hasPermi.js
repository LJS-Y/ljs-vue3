// 全部引入
import store from '@/store/index.js';

const hasPermi = {
  mounted (el, binding) {
    const show = geHasPermi(binding.value);
    // el.style.display = show ? 'inline' : 'none';
    if (!show) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
};

/**
 * 处理权限数据，判断获取结果
 * @param {Array} powerList 权限数组
 * @returns {String} 返回对应的能源种类单位value
 * @example const show = geHasPermi(binding.value);
 * */
export function geHasPermi(powerList) {
  // list 菜单级
  // query 查询
  // add 新增
  // export 导入
  // remove 删除
  // edit 编辑
  // const powers = ['query', 'add', 'list', 'export', 'remove', 'edit'];
  const allPower = store.getters.permissions;
  const all_permission = "*:*:*";
  if (allPower.includes(all_permission.toString())) {
    return true;
  }
  const nums = powerList.length;
  if (nums === 0) {
    return false;
  }
  for (let i = 0; i < nums; i++) {
    const p = powerList[i];
    if (!allPower.includes(p.toString())) {
      return false;
    }
  }
  return true;
}

export default {
  hasPermi
};
