/**
 * @module base
 * @description 基础常用处理方法
 *  */

/**
 * 获取请求中的指定参数的值
 * @param {String} key key
 * @returns {String} 返回指定key的参数值，如不存在返回null。
 * @example this.$LJSbase.getUrlParameter('moduleName');
 */
export function getUrlParameter(key) {
  let parameter = location.search
  if (parameter === '' || parameter.length === 0) {
    return null
  }
  parameter = parameter.slice(1, parameter.length)
  const ps = parameter.split('&')
  const nums = ps.length
  for (let i = 0; i < nums; i++) {
    const query = ps[i].split('=')
    if (query[0] === key) {
      if (query.length === 2) {
        return query[1]
      }
      break
    }
  }
  return null
}

/**
 * 树 - 获取选中的数据包括直系父的集合
 * @param {Array} data 原始数据
 * @param {String} value 选中的数据唯一值
 * @param {String} key 选中的数据唯一值对应的key，默认id
 * @param {String} children 子集对应的集合，默认children
 * @returns {Array} 选中的数据包括直系父的集合
 * @example const parents = this.$LJSbase.getTreeParents(data, value, key);
 */
export function getTreeParents(data, value, key = 'id', children = 'children', parents = []) {
  const nums = data.length
  for (let i = 0; i < nums; i++) {
    if (data[i][key] === value) {
      parents.unshift(data[i])
      return parents
    }
    if (data[i][children] !== undefined) {
      parents = getTreeParents(data[i][children], value, key, children, parents)
      if (parents.length > 0 && parents[parents.length - 1][key] === value) {
        parents.unshift(data[i])
        return parents
      }
    }
  }
  return parents
}

/**
 * 树数据 - 根据条件处理为部分禁用选择的新树
 * @param {Array} data 原始数据
 * @param {Array} opts 条件数组
 * @param {String} opts.value 需要禁用项的对比值
 * @param {String} opts.key 需要禁用项的对比值对应的键名
 * @param {Boolean} disabled 是否可以选择，自用参数，不对外开放。
 * @returns {Array} 根据条件返回一个部分禁用选择的树数据。
 * @example this.$LJSbase.editTreeParentIdCheck(data, [{value: 32, key: 'id'}, {value: 3, key: 'level'}]);
 * @example this.$LJSbase.editTreeParentIdCheck(data);
 */
export function editTreeParentIdCheck(data, opts = [], disabled = false) {
  if (!data) {
    return
  }
  const nums = data.length
  for (let i = 0; i < nums; i++) {
    data[i].disabled = disabled
    let bool = false
    const optsNums = opts.length
    for (let j = 0; j < optsNums; j++) {
      const opt = opts[j]
      if (data[i][opt.key] === opt.value) {
        bool = true
        break
      }
    }
    if (bool) {
      data[i].disabled = true
      data[i].children = editTreeParentIdCheck(data[i].children, opts, true)
    } else {
      if (data[i].children !== undefined) {
        data[i].children = editTreeParentIdCheck(data[i].children, opts, disabled)
      }
    }
  }
  return data
}

/**
 * 数据转换 - tree转list
 * @param {Array} treeList 待转换的树结构数据。
 * @param {Array} list 转换后的数据。
 * @example this.$LJSbase.handleTreeList(tree, []);
 */
export function handleTreeList(treeList, list = []) {
  if (!treeList || !treeList.length) {
    return []
  }
  for (let i = 0; i < treeList.length; i++) {
    let currentRow = treeList[i]
    let newRow = JSON.parse(JSON.stringify(currentRow))
    newRow.children = undefined
    list.push(newRow)
    this.handleTreeList(currentRow.children, list)
  }
}

/**
 * 数据转换 - list转tree
 * @param {Array} data 待转换的数据。
 * @param {String} id 自身id键。
 * @param {String} parentId 父id键。
 * @param {String} children children键。
 * @example this.$LJSbase.handleListTree(arr, 'id', 'pid');
 */
export function handleListTree(data, id, parentId, children) {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children',
  }

  var childrenListMap = {}
  var nodeIds = {}
  var tree = []

  for (let d of data) {
    let parentId = d[config.parentId]
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[config.id]] = d
    childrenListMap[parentId].push(d)
  }

  for (let d of data) {
    let parentId = d[config.parentId]
    if (nodeIds[parentId] == null) {
      tree.push(d)
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]]
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c)
      }
    }
  }
  return tree
}

/**
 * 根节点字体大小计算
 * @example this.$LJSbase.setRemUnit(); 返回结果根节点的font-size大小。
 */
export function setRemUnit() {
  var docEl = document.documentElement
  var rem = docEl.clientWidth / 120 // 可根据不同电脑分辨率进行手动修改（如1920*1080 为19.2
  docEl.style.fontSize = rem + 'px'
}

/**
 * 字典值回显，接口值回显
 * @param {Array} datas 基础数据
 * @param {String} value value
 * @param {String} labelKey 查找的名称key。如果参数值为$index，则返回索引值。
 * @param {String} valueKey 比对的数据key
 * @param {Boolean} isTrue false时为字符串，true时为布尔型
 * @returns {Array} 返回值所对应的文本。
 * @example this.$LJSbase.selectDictLabel(data, '1')
 */
export function selectDictLabel(datas, value, labelKey = 'dictLabel', valueKey = 'dictValue', isTrue = false) {
  if (value === undefined) {
    return ''
  }
  let actions = []
  Object.keys(datas).some((key, i) => {
    if (datas[key][valueKey] == '' + value) {
      if (labelKey === '$index') {
        actions = i
        return i
      } else {
        actions.push(datas[key][labelKey])
      }
      return true
    }
  })
  // 返回索引值
  if (labelKey === '$index') {
    return null
  }
  if (actions.length === 0) {
    actions.push(value)
  }
  if (isTrue) {
    return actions[0]
  }
  return actions.join('')
}

/**
 * 输出带颜色的日志
 * @param {Array} content log内容
 * @param {String} type 日志类型，与console同步
 * @param {Array} color 颜色，与content数据同步
 * @example const technicalSupport = ['技术支持：', ''];
 * colorLog(technicalSupport);
 */
export function colorLog(
  content = ['暂无内容'],
  type = 'info',
  color = [
    'background: #666666; color: #fff; border-radius: 4px 0 0 4px; padding: 3px 6px;',
    'background: #1475B2; color: #fff; border-radius: 0 4px 4px 0; padding: 3px 6px;',
  ],
) {
  let logStr = ''
  content.forEach((item) => {
    logStr += `%c${item}`
  })
  console[type](logStr, color[0], color[1])
}

/**
 * 下载图片 - 根据图片地址提供下载功能
 * @param {Object} _this this
 * @param {String} url 图片的绝对路径
 * @param {String} name 图片名称
 * @example this.$LJSbase.downloadImage(this, scope.row.quickResponseCode, `${scope.row.itemName}-${scope.row.typeName}-${scope.row.itemNo}`);
 */
export function downloadImage(_this, url, name = new Date().valueOf()) {
  let image = new Image()
  // 解决跨域 canvas污染问题
  image.setAttribute('crossOrigin', 'anonymous')
  image.src = url + '?time=' + new Date().valueOf() // 加时间戳
  _this.$nextTick(() => {
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, image.width, image.height)
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.download = name
        a.href = url
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      })
    }
  })
}

/**
 * 字段判断：判断某个字段，是否为undefined、null、''。
 * @param {any} field 需要判断的字段
 * @returns {Boolean} 该字段是否为undefined || null || ''。
 * @example this.$LJSbase.fieldCheck(this.aaaa)
 */
export function fieldCheck(field) {
  if (field === undefined || field === null || field === '') {
    return true
  }
  return false
}

/**
 * 字段清除：常用于输入框输入内容后显示的小×按钮。
 * @param {Object} obj 对象
 * @param {String} key 该对象的键名
 * @returns {Boolean} 清除已输入内容。
 * @example this.$LJSbase.fieldClean(obj, 'name')
 */
export function fieldClean(obj, key) {
  obj[key] = ''
}

/**
 * 图片流转换为base64
 * @param {Blob} fileFlow 文件流
 * @returns {String} 返回base64，不是流或文件则返回空字符串。
 * @example const base64Str = await this.$LJSbase.imageFileToBase64(fileFlow);
 */
export function imageFileToBase64(fileFlow) {
  if (fileFlow instanceof Blob || fileFlow instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      // 设置文件加载完成事件的回调函数
      reader.onloadend = () => resolve(reader.result)

      try {
        // 开始读取文件
        reader.readAsDataURL(fileFlow)
      } catch (error) {
        reject(error)
      }
    })
  } else {
    return ''
  }
}

/**
 * 获取浏览器的百分比
 * @returns {Number} 返回浏览器的百分比数值。
 * @example this.$LJSbase.getWindowRatio();
 */
export function getWindowRatio() {
  var ratio = 0
  var screen = window.screen
  var ua = navigator.userAgent.toLowerCase()

  if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio
  } else if (~ua.indexOf('msie')) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI
    }
  } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    ratio = window.outerWidth / window.innerWidth
  }

  if (ratio) {
    ratio = Math.round(ratio * 100)
  }
  return ratio
}

/**
 * 深拷贝
 * @param {Any} obj 待深拷贝数据
 * @returns {Any} 返回深拷贝后的数据。
 * @example this.$LJSbase.deepCopy();
 */
export function deepCopy(obj) {
  let result = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key])
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}

/**
 * 接口数据处理
 * @param {Any} res 接口返回的数据
 * @returns {Any} 处理后的数据。
 * @example this.$LJSbase.apiDateChange(res);
 */
export function apiDateChange(res) {
  let result = Array.isArray(res) ? [] : {}
  for (let key in res) {
    if (res.hasOwnProperty(key)) {
      if (typeof res[key] === 'object' && res[key] !== null) {
        result[key] = apiDateChange(res[key])
      } else {
        result[key] = !fieldCheck(res[key]) ? res[key] : ''
      }
    }
  }
  return result
}

/**
 * 获取系统信息
 * @returns {Any} 处理后的数据。
 * @example this.$LJSbase.getWindowInfo();
 */
export function getWindowInfo() {
  return uni.getWindowInfo()
}

/**
 * 获取顶部状态栏高度
 * @returns {Any} 处理后的数据。
 * @example this.$LJSbase.getTopStateHeight();
 */
export function getTopStateHeight() {
  return getWindowInfo().statusBarHeight
}

/**
 * 获取微信 APP 基础信息
 * @returns {Any} 处理后的数据。
 * @example this.$LJSbase.getAppBaseInfo();
 */
export function getAppBaseInfo() {
  return uni.getAppBaseInfo()
}

export default {
  setRemUnit,
  getTreeParents,
  editTreeParentIdCheck,
  handleTreeList,
  handleListTree,
  colorLog,
  selectDictLabel,
  getUrlParameter,
  downloadImage,
  fieldCheck,
  fieldClean,
  imageFileToBase64,
  getWindowRatio,
  deepCopy,
  apiDateChange,
  getWindowInfo,
  getAppBaseInfo,
  getTopStateHeight,
}

const lineStart = ['line', '***********************************']
colorLog(lineStart)
const technicalSupport = ['技术支持：', '龙九山']
colorLog(technicalSupport)
const lineEnd = ['line', '***********************************']
colorLog(lineEnd)
