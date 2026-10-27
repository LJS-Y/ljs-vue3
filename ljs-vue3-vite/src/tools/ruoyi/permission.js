import { geHasPermi } from '@/tools/directives/module/hasPermi.js';
import { geHasRole } from '@/tools/directives/module/hasRole.js';

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 * @example this.checkPermi(['system:user:add'])
 */
export function checkPermi(value) {
  return geHasPermi(value);
}

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @param {Boolean} admin 是否包含超管角色。如果true则为A角色或超管可看；如果为false则为A角色可看，超管不可看。
 * @returns {Boolean}
 * @example this.checkRole(['ylf'])
 */
export function checkRole(value, admin = true) {
  return geHasRole(value, admin);
}