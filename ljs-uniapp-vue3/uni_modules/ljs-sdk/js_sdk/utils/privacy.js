/**
 * @module 隐私 - 用户
 * @description 基础常用处理方法
 *  */

/**
 * 脱敏 - 姓名
 * @param {String} name 姓名
 * @returns {String} 返回脱敏后的数据
 * @example this.$LJSprivacy.desensitizationName('张三');
 */
export function desensitizationName(name) {
	const nums = name.length
	if (nums === 2) {
		const start = name.slice(0, 1)
		return start + '*'
	} else if (nums > 2) {
		const start = name.slice(0, 1)
		const end = name.slice(nums - 1, nums)
		return start + '*' + end
	}
	return name
}

/**
 * 脱敏 - 手机号
 * @param {String} phone 手机号
 * @param {String} handleNum 需要脱敏的数量
 * @returns {String} 返回脱敏后的数据
 * @example this.$LJSprivacy.desensitizationPhone('13200001234');
 */
export function desensitizationPhone(phone, handleNum = 4) {
	phone = phone + ''
	const nums = phone.length
	if (nums === 11) {
		const start = phone.slice(0, 3)
		const end = phone.slice(3 + handleNum, nums)
		let xing = ''
		for (let i = 0; i < handleNum; i++) {
			xing += '*'
		}
		return start + xing + end
	} else if (nums === 7 || nums === 8) {
		const start = phone.slice(0, 2)
		const end = phone.slice(2 + handleNum, nums)
		let xing = ''
		for (let i = 0; i < handleNum; i++) {
			xing += '*'
		}
		return start + xing + end
	} else {
		const start = phone.slice(0, 2)
		const end = phone.slice(nums - 2, nums)
		let xing = ''
		for (let i = 0; i < nums - 4; i++) {
			xing += '*'
		}
		return start + xing + end
	}
}

/**
 * 脱敏 - 身份证号
 * 也可用于其他文本的脱敏处理
 * @param {String} str 身份证号
 * @param {Number} keepStart 前保留
 * @param {Number} keepEnd 后保留
 * @param {String} maskChar 脱敏符号
 * @param {Number} maskLength 脱敏符号显示的数量
 * @returns {String} 返回脱敏后的数据
 * @example this.$LJSprivacy.desensitizationStr({ str: '640323198906252017' })
 */
export function desensitizationStr({
	str,
	keepStart = 3,
	keepEnd = 4,
	maskChar = '*',
	maskLength = 4
}) {
	if (!str || str.length < keepStart + keepEnd) return str + maskChar.repeat(maskLength)
	const start = str.slice(0, keepStart)
	const end = keepEnd !== 0 ? str.slice(-keepEnd) : ''
	// 真实的位数进行脱敏处理
	// maskLength = str.length - keepStart - keepEnd
	return start + maskChar.repeat(maskLength) + end
}

export default {
	desensitizationName,
	desensitizationPhone,
	desensitizationStr,
}