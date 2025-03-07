/** 
 * @module form
 * @description 表单常用处理方法
 *  */
import D from './date';

/**
 *  只能输入固定位数的正负数字，可小数。
 *  @param {Object} opt 配置对象
 *  @param {Object} opt.form 对象
 *  @param {String} opt.key 键名，不叫money时需要传入新的键名。默认值：'money'
 *  @param {Number} opt.zs 整数位数，传1代表1位整数。默认值：''，表示不限位数。同时限制opt.zs和opt.ws，可不用限制maxLength，此限制可以严格按照后端提供的整数和小数位数限制输入。
 *  @param {Number} opt.ws 小数位数，传1代表1位小数。默认值：''，表示不限位数
 *  @param {String} opt.type 默认数字类型的字符串，不支持首位多个0；传入String，支持以下格式。00.1；0001221。一般不会有这种使用需求。。默认值：'Number'
 *  @param {Boolean} opt.fu 是否支持-负数符号。默认值：false
 *  @example 
this.$ljsPublic.formCheck.numDxsCheck({
	form: form,
	key: 'companyName',
	zs: 8,
	ws: 4,
	fu: true
})
 * */
export function numDxsCheck(opt) {
	setTimeout(() => {
		const allOpt = {
			form: null, // 对象
			key: 'money', // 键名，不叫money时需要传入新的键名
			zs: '', // 几位整数，默认不限位数，传1代表1位整数
			ws: '', // 几位小数，默认不限位数，传1代表1位小数
			type: 'Number', // 默认数字类型的字符串，不支持首位多个0；传入String，支持以下格式。00.1；0001221。一般不会有这种使用需求。
			fu: false // 是否支持-负数符号
		};
		for (let key in opt) {
			allOpt[key] = opt[key];
		}
		const obj = allOpt.form;
		const key = allOpt.key;
		obj[key] = obj[key] + '';
		if (allOpt.type === 'Number') {
			// 首位是0，第二位必须是.
			if (obj[key].slice(0, 1) === '0') {
				obj[key] = obj[key].slice(1, 2) !== '.'?'0':obj[key];
			}
			// 首位是-，第二位不能是.
			if (obj[key].slice(0, 1) === '-') {
				obj[key] = obj[key].slice(1, 2) === '.'?'-':obj[key];
			}
			// 首位是-0，第三位必须是.
			if (obj[key].slice(0, 2) === '-0') {
				obj[key] = obj[key].slice(2, 3) !== '.'?'-0':obj[key];
			}
		}
		// 先把非数字的都替换掉，除了数字和.
		if (allOpt.fu) {
			obj[key] = obj[key].replace(/[^\d.-]/g, '');
		} else {
			obj[key] = obj[key].replace(/[^\d.]/g, '');
		}
		// 必须保证第一个为数字而不是.
		obj[key] = obj[key].replace(/^\./g, '');
		// 保证只有出现一个.而没有多个.
		obj[key] = obj[key].replace(/\.{2,}/g, '.');
		// 保证只有出现一个-号，且在首位
		obj[key] = obj[key].slice(0, 1) + obj[key].slice(1, obj[key].length).replace(/\-/g, '');

		// 动态正则，小数位动态处理
		const c = new RegExp('^(\\-)*(\\d+)\\.(\\d{0,' + allOpt.ws + '})\.*$');

		// 限制整数位
		if (allOpt.zs !== '' && obj[key].length > 0) {
			const nums = obj[key].split('.');
			let zsNum = nums[0];
			let xsNum = '';
			const zsLength = zsNum.slice(0, 1) === '-' ? 1 : 0; // 负数时，整数位数需+1计算。
			if (zsNum.length > allOpt.zs + zsLength) {
				zsNum = zsNum.slice(0, allOpt.zs + zsLength);
			}
			if (nums.length > 1) {
				xsNum = nums[1];
				obj[key] = zsNum + '.' + xsNum;
			} else {
				obj[key] = zsNum;
			}
		}
		// 只能输入两个小数
		obj[key] = obj[key].replace(c, '$1$2.$3');
	}, 50)
}

/**
	*  只能输入数字。
	*  @param {object} form 表单对象
	*  @param {String} key 键名不叫num时需要传入新的键名
	*  @param {String} type 默认数字类型的字符串，不支持首位多个0；传入String，支持以下格式。00.1；0001221。一般用于编码类需求。
	*  @param {Boolean} numberFristIs0 type = 'Number'的情况下，能否输入数字0，默认是可以输入
	*  @example this.$ljsPublic.formCheck.numCheck(obj, 'goodsPrice')
	* */
export function numCheck(form, key = 'num', type = 'Number', numberFristIs0 = true) {
	setTimeout(() => {
		if (type === 'Number' && !numberFristIs0) {
			// 首位不能是0
			form[key] = form[key].slice(0, 1) === '0' ? '' : form[key];
		}
		form[key] = form[key].replace(/[^\d]/g, '');

		// 处理为数字
		// if (type === 'Number' && form[key].length > 0) {
		// 	form[key] = Number(form[key]);
		// }
	}, 50)
}

/**
	*  只能输入：数字、字母
	*  @param {object} form 表单对象
	*  @param {string} key 键名不叫username时需要传入新的键名
	*  @example this.$ljsPublic.formCheck.numEnCheck(obj, 'username')
	* */
export function numEnCheck(form, key = 'username') {
	setTimeout(() => {
		form[key] = form[key] + '';

		// 数字、字母及下划线
		form[key] = form[key].replace(/[^\w]/g, '');
		// 去掉下划线
		form[key] = form[key].replace(/\_/g, '');
	}, 50)
}

/**
 * Blob数据流下载，来源于后端接口返回
 * @param {Blob} data 流
 * @param {String} title 下载后的文件名称
 * @example this.$ljsPublic.formCheck.downloadBlobData(res.data, "房屋价格")，请求需要添加 responseType: "blob"
 * */
export function downloadBlobData(data, title) {
	const link = document.createElement('a');
	const blob = new Blob([data], {
		type: 'application/vnd.ms-excel'
	});
	link.style.display = 'none';
	link.href = URL.createObjectURL(blob);
	link.setAttribute('download', title);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}


export default {
	numCheck,
	numEnCheck,
	numDxsCheck,
	downloadBlobData,
};
