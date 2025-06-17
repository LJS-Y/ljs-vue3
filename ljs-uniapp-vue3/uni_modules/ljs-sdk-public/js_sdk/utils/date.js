/**
 * @module date
 * @description 日期常用处理方法
 *  */
import LJSbase from './base'
import LJSnum from './num'

export function timeChange(time, replaceKey = ['-', '/']) {
  if (LJSbase.fieldCheck(time) || time.toString().indexOf(replaceKey[0]) === -1) return time
  time = time.replaceAll(replaceKey[0], replaceKey[1])
	// 2025/06/09 09:30:00.000，IOS设备不支持，去除.000
	if (time.indexOf('.') > -1) {
			time = time.split('.')[0]
	}
  // 处理只有年月的格式，IOS报错，自动补入默认/01日值
  if (time.lastIndexOf(replaceKey[1]) === 4) {
    time = time + '/01'
  }
  return time
}
/**
 * 通过传入的时间戳获取固定格式日期
 * @param {Date} time 时间戳
 * @param {String} pattern 输出格式，{y}-{m}-{d} {h}:{i}:{s}.{MS}
 * @return {String} 返回指定格式的日期。
 * @example this.$ljsPublic.date.formatTime(new Date().getTime(), '{y}-{m}-{d} {h}:{i}:{s}')，返回2021-12-22 09:56:58
 */
export function formatTime(time, pattern) {
  if (LJSbase.fieldCheck(time)) return time
  time = timeChange(time)
  const date = new Date(time)
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  const formatObj = {
    y: date.getFullYear(),
    m: LJSnum.numberB0(date.getMonth() + 1),
    d: LJSnum.numberB0(date.getDate()),
    h: LJSnum.numberB0(date.getHours()),
    i: LJSnum.numberB0(date.getMinutes()),
    s: LJSnum.numberB0(date.getSeconds()),
    MS: date.getMilliseconds(),
  }
  return format.replace(/{(y|m|d|h|i|s|MS)+}/g, (result, key) => {
    const value = formatObj[key]
    return value
  })
}

/**
 * 定制日期
 * 如前一天、前一个月、前一年
 * @param {Date} time 时间戳
 * @param {String} pattern 输出格式，{y}-{m}-{d}，只处理年、月、日数据。
 * @param {Number} span 步幅，正数为未来日期，负数为过去日期。默认为0。
 * @return {String} 返回指定格式的指定日期。
 * @example this.$ljsPublic.date.customizedDate(new Date().getTime(), '{y}-{m}-{d}', -1); // 当前日期：2024-03-28，返回：2024-03-27
 */
export function customizedDate(time, pattern, span = 0) {
  if (LJSbase.fieldCheck(time)) return time
  time = timeChange(time)
  if (span === 0) {
    let t = new Date(time).getTime()
    return formatTime(t, pattern)
  }
  if (pattern === '{y}-{m}-{d}') {
    let t = new Date(time).getTime()
    t = t + 3600 * 1000 * 24 * span
    return formatTime(t, pattern)
  } else if (pattern === '{y}-{m}') {
    // time = '2024-01'
    const direction = span / Math.abs(span)
    let t = new Date(time)
    let str = ''
    const month = t.getMonth() + 1
    let y = 0
    let m = 0
    if (direction === -1) {
      y = t.getFullYear() + Math.floor((month + span) / 12)
      m = 12 * Math.abs(y - t.getFullYear()) + month + span
      if ((month + span) % 12 === 0) {
        y += direction
        m = 12
      }
    } else if (direction === 1) {
      if (month + span <= 12) {
        y = t.getFullYear()
        m = month + span
      } else {
        if ((month + span) % 12 !== 0) {
          y = t.getFullYear() + Math.floor((month + span) / 12)
          m = month + span - Math.abs(y - t.getFullYear()) * 12
        } else {
          const addY = (month + span) / 12
          y = t.getFullYear() + (addY > 1 ? addY - 1 : addY)
          m = month + span - Math.abs(y - t.getFullYear()) * 12
        }
      }
    }
    str = y + '-' + LJSnum.numberB0(m)
    return str
  } else if (pattern === '{y}') {
    let t = new Date(time)
    return (t.getFullYear() + span).toString()
  }
}

/**
 * 时间处理函数：传入[开始日期, 结束日期]，期望返回数据为[2020-10-01 00:00:00, 2020-10-01 23:59:59]
 * @param {Array} dates [开始日期, 结束日期]
 * @param {Number} tag 1，补时分秒；2，补分秒；3，补秒
 * @returns {Array} 返回一个所需规格的[开始日期, 结束日期]
 * @example this.$ljsPublic.date.dateQjChange(["2020-10-01", "2020-10-07"], 1)，返回["2020-10-01 00:00:00", "2020-10-07 23:59:59"]
 * */
export function dateQjChange(dates, tag = 1) {
  if (dates[0] === '' || dates[0] === null) {
    return dates
  }
  dates[0] = timeChange(dates[0])
  dates[1] = timeChange(dates[1])
  const d1 = new Date(dates[0])
  const d2 = new Date(dates[1])
  if (tag === undefined) {
    tag = 1
  }
  switch (tag) {
    case 1:
      return [
        d1.getFullYear() + '-' + LJSnum.numberB0(d1.getMonth() + 1) + '-' + LJSnum.numberB0(d1.getDate()) + ' 00:00:00',
        d2.getFullYear() + '-' + LJSnum.numberB0(d2.getMonth() + 1) + '-' + LJSnum.numberB0(d2.getDate()) + ' 23:59:59',
      ]
    case 2:
      return [
        d1.getFullYear() +
          '-' +
          LJSnum.numberB0(d1.getMonth() + 1) +
          '-' +
          LJSnum.numberB0(d1.getDate()) +
          ' ' +
          LJSnum.numberB0(d1.getHours()) +
          ':00:00',
        d2.getFullYear() +
          '-' +
          LJSnum.numberB0(d2.getMonth() + 1) +
          '-' +
          LJSnum.numberB0(d2.getDate()) +
          ' ' +
          LJSnum.numberB0(d2.getHours()) +
          ':59:59',
      ]
    case 3:
      return [
        d1.getFullYear() +
          '-' +
          LJSnum.numberB0(d1.getMonth() + 1) +
          '-' +
          LJSnum.numberB0(d1.getDate()) +
          ' ' +
          LJSnum.numberB0(d1.getHours()) +
          ':' +
          LJSnum.numberB0(d1.getMinutes()) +
          ':00',
        d2.getFullYear() +
          '-' +
          LJSnum.numberB0(d2.getMonth() + 1) +
          '-' +
          LJSnum.numberB0(d2.getDate()) +
          ' ' +
          LJSnum.numberB0(d2.getHours()) +
          ':' +
          LJSnum.numberB0(d2.getMinutes()) +
          ':59',
      ]
  }
  return dates
}

/**
 * 根据时间戳返回时长，如3小时15分23秒
 * @param {Number} time 时长，毫秒数的时长
 * @param {Array} showTag 展示的标签，['天', '小时', '分钟', '秒', '毫秒']
 * @param {Boolean} showAll 默认完整展示
 * @returns {String} 返回3小时15分23秒
 * @example
const runTime = this.$ljsPublic.date.timeRunDistance({
  time: 3600*1000*24 + 3600*1000*2 + 60*1000*4 + 1000* 21 + 876,
  showAll: false
})
console.log(runTime);
 * */
export function timeRunDistance({ time = 0, showTag = ['天', '小时', '分钟', '秒', '毫秒'], showAll = true }) {
  if (time < 0) {
    console.warn('时间距离需大于0。')
    return
  }
  const hm = 1000 // 1秒
  const m = 60 * hm // 1分钟
  const h = 60 * m // 1小时
  const d = 24 * h // 1天
  const times = [0, 0, 0, 0, 0]
  if (time >= d) {
    const num = Math.floor(time / d)
    times[0] = num
    time -= d * num
  }
  if (time >= h) {
    const num = Math.floor(time / h)
    times[1] = num
    time -= h * num
  }
  if (time >= m) {
    const num = Math.floor(time / m)
    times[2] = num
    time -= m * num
  }
  if (time >= hm) {
    const num = Math.floor(time / hm)
    times[3] = num
    time -= hm * num
  }
  times[4] = time

  let tag = false
  if (showAll) {
    tag = true
  }
  let str = ''
  times.forEach((t, i) => {
    if (!tag && t !== 0) {
      tag = true
    }
    if (tag) {
      str += t + showTag[i]
    }
  })
  return str
}

/**
 * 区间日期
 * 统一处理方法，常用于默认的区间日期表单
 * @param {number} day 跨度
 * @param {Boolean} time 是否开启时分秒
 * @returns {Array} 返回默认起止日期
 * @example this.$ljsPublic.date.initSearchDate()，返回["2020-10-01", "2020-10-10"]
 * */
export function initSearchDate(day = 10, time = false) {
  let start = ''
  let end = ''
  let formatValue = '{y}-{m}-{d}'
  if (time) {
    formatValue = '{y}-{m}-{d} {h}:{i}:{s}'
  }
  start = formatTime(new Date().getTime() - 3600 * 1000 * 24 * (day - 1), formatValue)
  end = formatTime(new Date(), formatValue)
  return [start, end]
}

/**
 * 获取当月，当年，近n年的区间
 * @param {String} type 类型：datetime,date,month,year
 * @param {Number} n 年类型的跨度
 * @returns {Array} 返回默认起止日期
 * @example this.$ljsPublic.date.initSearchDateQj()，返回["2020-10-01", "2020-10-10"]
 * */
export function initSearchDateQj(type = 'date', n = 0) {
  const date = new Date()
  let start = ''
  let end = ''
  switch (type) {
    case 'datetime':
      start = formatTime(date, '{y}-{m}-{d} 00:00:00')
      end = formatTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
      break
    case 'date':
      start = formatTime(date, '{y}-{m}-01')
      end = formatTime(date, '{y}-{m}-{d}')
      break
    case 'month':
      start = formatTime(date, '{y}-01')
      end = formatTime(date, '{y}-{m}')
      break
    case 'year':
      start = date.getFullYear() - (n + 1) * 5
      end = date.getFullYear()
      break
  }
  return [start, end]
}

export default {
  formatTime,
  customizedDate,
  dateQjChange,
  timeRunDistance,
  initSearchDate,
  initSearchDateQj,
}
