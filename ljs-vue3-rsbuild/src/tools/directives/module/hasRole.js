// 全部引入
import store from '@/store/index.js';

const hasRole = {
  mounted (el, binding) {
    const show = geHasRole(binding.value);
    
    if (!show) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
};

/**
 * 处理权限数据，判断获取结果
 * @param {Array} roleList 权限数组
 * @returns {String} 返回对应的能源种类单位value
 * @example const show = getPower(binding.value);
 * */
export function geHasRole(roleList, admin = true) {
  const allRole = store.getters.roles;
  const super_admin = "admin";
  if (allRole.includes(super_admin.toString()) && admin) {
    return true;
  }
  const nums = roleList.length;
  if (nums === 0) {
    return false;
  }
  for (let i = 0; i < nums; i++) {
    const p = roleList[i];
    if (!allRole.includes(p.toString())) {
      return false;
    }
  }
  return true;
}

export default {
  hasRole
};
