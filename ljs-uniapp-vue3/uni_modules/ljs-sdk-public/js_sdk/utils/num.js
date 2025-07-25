/**
 * @module num
 * @description 数字处理类
 *  */

const limit_min_num = 1e-14 // 精度极小值

/**
 *  个位数字补零，常用于日期
 * @param {Number, String} n 数字
 * @param {Number} num 位数，将要补成几位
 * @param {string} fillStr 填充的字符
 * @returns {string} 补零后的数字
 * @example this.$LJSnum.numberB0(1, 4)，返回0001
 *  */
export function numberB0(n, num = 2, fillStr = '0') {
  if (checkNum(n)) {
    n = n.toString()
    const wNum = n.length
    const zeroNum = num - wNum
    let zero = ''
    for (let i = 0; i < zeroNum; i++) {
      zero += fillStr
    }
    return zero + n
  }
  return n
}

/**
 * 金额分割符
 * @param {string} value 需要进行分割的数字
 * @param {Number} fw 人民币分位符：4；美元分位符：3；
 * @param {string} symbol 分隔符
 * @returns {string} 返回分割完成的数字
 * @example this.$LJSnum.moneySplit(3889999) 返回结果为388,9999
 * */
export function moneySplit(value, fw = 4, symbol = ',') {
  if (checkNum(value)) {
    value += ''
    var x = value.split('.')
    var x1 = x[0]
    var x2 = x.length > 1 ? '.' + x[1] : ''
    const rgx = new RegExp('(\\d+)(\\d{' + fw + '})')
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + symbol + '$2')
    }
    return x1 + x2
  }
  return value
}

/**
 * 整数上取舍：最大位数字升，其他位归0；对一个数字上取舍，适配万亿级别的数字，无上限。
 * @param {string} value 数字
 * @returns {number} 返回取舍完成的数字
 * @example this.$LJSnum.numberCeil(1234) 返回结果为2000
 * */
export function numberCeil(value) {
  if (checkNum(value)) {
    value = Math.ceil(value)
    const indexNum = (value + '').length
    const w = Math.pow(10, indexNum - 1)
    return Math.ceil(value / w) * w
  }
  return value
}

/**
 * 数字单位升级：数字进行万、亿、万亿处理
 * @param {string} value 原型数据
 * @param {Number} ws 保留几位小数
 * @returns {String} 返回升级后的数据。
 * @example this.$LJSnum.longNumText(12345, 1)，返回1.2万
 * */
export function longNumText(value, ws = 2) {
  if (checkNum(value)) {
    let result = ''
    const sign = Number(value) < 0 ? -1 : 1 // 正负符号
    const num = Math.abs(Number(value))
    if (num < 10000) {
      result = sign * num
    } else if (num >= 10000 && num < 10000 * 10000) {
      result = sign * (num / 10000 + limit_min_num).toFixed(ws) + '万'
    } else if (num >= 10000 * 10000 && num < 10000 * 10000 * 10000) {
      result = sign * (num / (10000 * 10000) + limit_min_num).toFixed(ws) + '亿'
    } else if (num >= 10000 * 10000 * 10000) {
      result = sign * (num / (10000 * 10000 * 10000) + limit_min_num).toFixed(ws) + '万亿'
    }
    return result
  }
  return value
}

/**
 * 数字保留小数位：数字、字符串，处理小数位。
 * 注：整数不保留小数位，非数字原样返回。
 * @param {String} value 原型数据
 * @param {String} ws 保留几位小数
 * @returns {String} 返回处理后的数据。
 * @example this.$LJSnum.numberChangeDecimal(12.3456)
 * */
export function numberChangeDecimal(value, ws = 2) {
  if (checkNum(value)) {
    value = value + ''
    if (value.indexOf('.') > -1) {
      // 优化：原数字小于位数的再做处理
      if (value.split('.')[1].length > ws) {
        value = Number(value)
        return (value + limit_min_num).toFixed(ws)
      }
    }
  }
  return value
}

/**
 * 是否为数字：做数字处理前需要知道传入的数据是否为数字。
 * 此处已经判断了number，string类型的数字。
 * 暂不开放，仅num.js内部使用。
 * @param {String} value 字典数据
 * @returns {Boolean} 是否为数字
 * @example this.$LJSnum.checkNum(12.3456)
 * */
export function checkNum(value) {
  const type = typeof value
  if (type === 'number' || (type === 'string' && !isNaN(Number(value, 10)))) {
    return true
  }
  return false
}

/**
 * 平均处理：把一个总数按照约定份数进行平均。
 * @param {String} total 总数值
 * @param {Number} shares 需要平均成多少份，默认12份
 * @param {Number} decimal 保留小数位，默认2位
 * @returns {Array} 返回平均好的数据集合
 * @example this.$LJSnum.averageNum(10000)
 * */
export function averageNum(total, shares = 12, decimal = 2) {
  total = Number(total)
  const one = (total / shares).toFixed(decimal)
  const result = []
  for (let i = 0; i < shares; i++) {
    if (i < shares - 1) {
      result.push(one)
    } else {
      result.push(numberChangeDecimal(total - one * (shares - 1), decimal))
    }
  }
  return result
}

export default {
  numberB0,
  longNumText,
  numberCeil,
  moneySplit,
  numberChangeDecimal,
  averageNum,
}
