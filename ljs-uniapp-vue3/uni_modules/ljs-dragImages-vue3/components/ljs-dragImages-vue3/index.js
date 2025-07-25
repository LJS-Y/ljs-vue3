import icon_del from '../static/images/icon_del.png'
import icon_add from '../static/images/icon_add.png'
export default {
  // emits: ['input', 'update:value'],
  props: {
    // 文件列表数据
    modelValue: Array,
    // 是否开启拖拽排序，默认开启。如果关闭，则次插件将是一个普通的文件上传组件
    touchTarg: {
      type: Boolean,
      default: true,
    },
    // 文件上传数量限制
    count: {
      type: Number,
      default: 5,
    },
    // 列数量，默认3列
    colCount: {
      type: Number,
      default: 3,
    },
    // 文件框的高度 upx 值
    fileHeight: {
      type: Number,
      default: 165,
    },
    // 文件间距 upx 值
    fileMargin: {
      type: Number,
      default: 25,
    },
    // 文件框的边框
    fileBorder: {
      type: String,
      default: '2rpx solid #1e96d5',
    },
    // 文件框的圆角
    fileRadius: {
      type: Number,
      default: 30,
    },
    // 删除按钮的文件
    delButtonImage: {
      type: String,
      default: icon_del,
    },
    // 点击上传背景文件
    addButtonImage: {
      type: String,
      default: icon_add,
    },
    // image：只能拍摄图片或从相册选择图片；video：只能拍摄视频或从相册选择视频；mix：可同时选择图片和视频；
    mediaType: {
      type: Array,
      default: () => {
		  return ['image']
	  },
    },
    // album：从相册选择；camera：使用相机拍摄；
    sourceType: {
      type: Array,
      default: () => {
		  return ['album','camera']
	  },
    },
    // 拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 60s 之间。不限制相册。
    maxDuration: {
      type: Number,
      default: 10,
    },
    // 是否压缩所选文件，基础库2.25.0前仅对 mediaType 为 image 时有效，2.25.0及以后对全量 mediaType 有效
    sizeType: {
      type: Array,
      default: () => {
		  return ['original', 'compressed']
	  },
    },
    // 仅在 sourceType 为 camera 时生效，使用前置或后置摄像头。back	使用后置摄像头；front	使用前置摄像头
    camera: {
      type: String,
      default: 'back',
    },
  },
  data() {
    return {
      touchTime: {
        start: null, // 开始
        end: null, // 结束
        time: 0, // 触摸时间
      },
      dataList: [],
      moveBoxW: 0, // 拖拽区域宽度
      moveBoxH: 0, // 拖拽区域高度
      moveIndex: null, // 移动到的索引位置
      frist: true, // 首次进入
      domTag: null, // 元素标记， 1 dom未加载完成
      // 新增按钮的位置
      add: {
        x: 0,
        y: 0,
      },
      // 微信端记录运行值
      wx: {
        x: 0,
        y: 0,
      },
    }
  },
  watch: {
    modelValue: {
      handler(n) {
        if (this.frist && this.modelValue.length > 0) {
          if (this.moveBoxW !== 0) {
            this.initData()
            this.initXY()
            this.frist = false
          } else {
            this.domTag = 1
          }
        }
      },
      deep: true,
    },
    moveBoxW: {
      handler(n) {
        if (this.moveBoxW !== 0 && this.domTag === 1 && this.modelValue.length > 0) {
          this.domTag = null
          this.initData()
          this.initXY()
          this.frist = false
        }
      },
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    initData() {
      this.modelValue.forEach((item) => {
        this.dataList.push({
          name: item.name,
          url: item.url,
          x: 0,
          y: 0,
          oldx: 0,
          oldy: 0,
          zIndex: 1, // 层级
          sort: 99, // 排序
          opacity: 1, // 透明
          moveEnd: false, // 是否进入拖拽
        })
      })
    },
    // 点击文件
    imgC(obj) {
      this.$emit('imgClick', {
        name: obj.name,
        url: obj.url,
      })
    },
    // 删除
    dataListDel(index) {
      this.dataList.splice(index, 1)
      this.sortList()
    },
    // 选择文件
    uploadImg() {
      this.frist = false
      const msg = '最多上传' + this.count + '张文件。'
      if (this.dataList.length < this.count) {
		// #ifdef MP-WEIXIN
		wx.chooseMedia({
          mediaType: this.mediaType, // image：只能拍摄图片或从相册选择图片；video：只能拍摄视频或从相册选择视频；mix：可同时选择图片和视频；
		  sourceType: this.sourceType, // album：从相册选择；camera：使用相机拍摄；
		  maxDuration: this.maxDuration, // 拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 60s 之间。不限制相册。
		  sizeType: this.sizeType,
		  camera: this.camera,
		// #endif
		// #ifndef MP-WEIXIN
        uni.chooseImage({
          sizeType: ['original'], // 上传原图
		// #endif
          count: this.count,
          success: (res) => {
            let pushDataTag = false // msg是否提示
            res.tempFiles.forEach((item) => {
              if (this.dataList.length < this.count) {
                this.dataList.push({
				  // #ifdef MP-WEIXIN
				  name: this.getFileName(item.tempFilePath, true),
				  url: item.tempFilePath,
				  // #endif
				  // #ifndef MP-WEIXIN
				  name: item.name,
				  url: item.path,
				  // #endif
                  x: 0,
                  y: 0,
                  oldx: 0,
                  oldy: 0,
                  zIndex: 1, // 层级
                  sort: 99, // 排序
                  opacity: 1, // 透明
                  moveEnd: false, // 是否进入拖拽
                })
                this.initXY()
              } else {
                if (!pushDataTag) {
                  uni.showToast({
                    title: msg,
                    duration: 3000,
                    icon: 'none',
                  })
                  pushDataTag = true
                }
              }
            })
            const files = []
            this.dataList.forEach((item) => {
              files.push({
                name: item.name,
                url: item.url,
              })
            })
            this.$emit('uploadFile', files)
          },
        })
      } else {
        uni.showToast({
          title: msg,
          duration: 3000,
          icon: 'none',
        })
      }
    },
    init() {
      // 获取元素宽度
      const query = uni.createSelectorQuery().in(this)
      query
        .select('#moveBox')
        .boundingClientRect((data) => {
          this.moveBoxW = this.pxToRpx(data.width)
          this.moveBoxH = this.pxToRpx(data.height)
        })
        .exec()
    },
    getWindowInfo() {
      return uni.getWindowInfo()
    },
    // 拖 - 开始
    touchstart(item) {
      this.touchTime = {
        start: new Date().getTime(), // 开始
        end: null, // 结束
        time: 0, // 触摸时间
      }
      if (!item.moveEnd) {
        item.zIndex = 99
        item.moveEnd = true
        this.dataList.forEach((other) => {
          other.opacity = 0.6
        })
        this.timer = setTimeout(() => {
          item.opacity = 1
          clearTimeout(this.timer)
          this.timer = null
        }, 200)
      }
    },
    // 拖 - 结束
    touchend(item) {
      this.touchTime.end = new Date().getTime()
      this.touchTime.time = this.touchTime.end - this.touchTime.start
      if (this.touchTime.time <= 100) return
      if (item.moveEnd) {
        item.zIndex = 1
        item.moveEnd = false
        item.opacity = 1
        if (this.moveIndex > this.dataList.length - 1) {
          this.moveIndex = this.dataList.length - 1
        }
        const temp = item.sort

        if (this.moveIndex !== null) {
          if (temp !== this.moveIndex) {
            // 互换排序
            item.sort = this.dataList[this.moveIndex].sort
            this.dataList[this.moveIndex].sort = temp
            // 互换原始值
            const oldx = item.oldx
            const oldy = item.oldy
            item.oldx = this.dataList[this.moveIndex].oldx
            item.oldy = this.dataList[this.moveIndex].oldy
            this.dataList[this.moveIndex].oldx = oldx
            this.dataList[this.moveIndex].oldy = oldy
            this.sortList()
          } else {
            // #ifdef MP-WEIXIN
            item.x += 1
            setTimeout(() => {
              item.x -= 1
            }, 200)
            // #endif
            // #ifndef MP-WEIXIN
            item.x = item.oldx
            item.y = item.oldy
            // #endif
          }
        }
        this.dataList.forEach((other) => {
          other.opacity = 1
        })
      }
    },
    // 拖动过程中触发的事件，event.detail = {x: x, y: y, source: source}，
    // 其中source表示产生移动的原因，值可为touch（拖动）、touch-out-of-bounds（超出移动范围）、
    // out-of-bounds（超出移动范围后的回弹）、friction（惯性）和空字符串（setData）
    onChange(e, item) {
      if (!item) return
      if (item.moveEnd) {
        const x = e.detail.x
        const y = e.detail.y
        // console.log(1, x, y)
        // console.log(2, item.x, item.y)
        const oneItemW = (this.moveBoxW - (this.colCount - 1) * this.fileMargin) / this.colCount
        // #ifdef MP-WEIXIN
        // #endif
        // #ifndef MP-WEIXIN
        item.x = x
        item.y = y
        // #endif
        if (e.detail.source === 'touch') {
          let moveX = 0 // 横向几个
          let moveY = 0 // 纵向几行
          const lieNum = Math.ceil((this.dataList.length + 1) / this.colCount)
          // 行
          for (let i = 1; i < this.colCount; i++) {
            if (this.pxToRpx(x) / (oneItemW * (i - 0.5) + this.fileMargin * (i - 1)) >= 1) {
              moveX = i
            }
          }
          // 列
          for (let i = 1; i < lieNum; i++) {
            if (this.pxToRpx(y) / ((this.fileHeight + this.fileMargin) * (i - 0.5)) >= 1) {
              moveY = i
            }
          }
          this.moveIndex = moveY * this.colCount + moveX
        } else {
          this.moveIndex = null
        }
      } else {
        // #ifdef MP-WEIXIN
        // #endif
        // #ifndef MP-WEIXIN
        item.x = item.oldx
        item.y = item.oldy
        // #endif
      }
    },
    pxToRpx(v) {
      return (750 * v) / uni.getWindowInfo().windowWidth
    },
    rpxToPx(v) {
      return (uni.getWindowInfo().windowWidth * v) / 750
    },
    // 排序
    sortList() {
      this.dataList.sort((a, b) => {
        return a.sort - b.sort
      })
      setTimeout(() => {
        this.$nextTick(() => {
          this.initXY()
        })
      }, 0)
    },
    // 初始化元素的位置，根据dataList数组的数量计算
    initXY() {
      const oneItemW = (this.moveBoxW - (this.colCount - 1) * this.fileMargin) / this.colCount
      this.dataList.forEach((item, i) => {
        const x = (i % this.colCount) * (this.rpxToPx(oneItemW) + this.rpxToPx(this.fileMargin))
        const y = Math.floor(i / this.colCount) * this.rpxToPx(this.fileHeight + this.fileMargin)
        item.x = x
        item.y = y
        item.oldx = x
        item.oldy = y
        item.zIndex = 1 // 层级
        item.sort = i // 排序
        item.opacity = 1 // 透明
        item.moveEnd = false // 是否进入拖拽
		// #ifdef MP-WEIXIN
        item.fileType = this.getFileType(item.url) // 是否进入拖拽
		// #endif
		// #ifndef MP-WEIXIN
        item.fileType = this.getFileType(item.name) // 是否进入拖拽
		// #endif
      })
      const i = this.dataList.length
      const x = (i % this.colCount) * (this.rpxToPx(oneItemW) + this.rpxToPx(this.fileMargin))
      const y = Math.floor(i / this.colCount) * this.rpxToPx(this.fileHeight + this.fileMargin)
      this.add.x = x
      this.add.y = y

      this.$emit('update:modelValue', this.dataList)
    },
	getFileType(str, showDot = true) {
	  if (str === undefined || str === null || str === '') {
		console.warn(`传入参数不存在，请检查参数值。`);
		return null;
	  }
	  let lastIndex = str.lastIndexOf('.');
	  if (lastIndex === -1) {
		console.warn(`传入参数不是合法的文件名字符串，请检查参数值。`);
		return null;
	  }
	  lastIndex = showDot ? lastIndex : lastIndex + 1;
	  return str.slice(lastIndex, str.length);
	},
	getFileName(str, showSuffix = false) {
	  const index1 = str.lastIndexOf('/')
	  const index2 = str.lastIndexOf('\\')
	  let lastIndex = index1 > index2 ? index1 : index2
	  if (lastIndex !== -1) {
	    lastIndex++
	  } else {
	    lastIndex = 0
	  }
	  if (showSuffix) {
	    return str.slice(lastIndex, str.length)
	  } else {
	    if (str.lastIndexOf('.') > -1) {
	      return str.slice(lastIndex, str.lastIndexOf('.'))
	    } else {
	      return str.slice(lastIndex, str.length)
	    }
	  }
	}
  },
}
