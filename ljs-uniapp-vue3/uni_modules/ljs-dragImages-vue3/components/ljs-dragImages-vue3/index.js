import icon_del from '../static/images/icon_del.png';
import icon_add from '../static/images/icon_add.png';
export default {
	// emits: ['input', 'update:value'],
	props: {
		// 图片列表数据
		modelValue: Array,
		// 是否开启拖拽排序，默认开启。如果关闭，则次插件将是一个普通的图片上传组件
		touchTarg: {
			type: Boolean,
			default: true
		},
		// 图片上传数量限制
		count: {
			type: Number,
			default: 5
		},
		// 列数量，默认3列
		colCount: {
			type: Number,
			default: 3
		},
		// 图片框的高度 upx 值
		imgHeight: {
			type: Number,
			default: 165
		},
		// 图片间距 upx 值
		imgMargin: {
			type: Number,
			default: 25
		},
		// 图片框的边框
		imgBorder: {
			type: String,
			default: '2rpx solid #1e96d5'
		},
		// 图片框的圆角
		imgRadius: {
			type: Number,
			default: 30
		},
		// 删除按钮的图片
		delButtonImage: {
			type: String,
			default: icon_del
		},
		// 点击上传背景图片
		addButtonImage: {
			type: String,
			default: icon_add
		},
	},
	data() {
		return {
			touchTime: {
				start: null, // 开始
				end: null, // 结束
				time: 0, // 触摸时间
			},
			dataList: this.modelValue,
			moveBoxW: 0, // 拖拽区域宽度
			moveBoxH: 0, // 拖拽区域高度
			moveIndex: null, // 移动到的索引位置
			frist: true, // 首次进入
			// 新增按钮的位置
			add: {
				x: 0,
				y: 0,
			},
			// 微信端记录运行值
			wx: {
				x: 0,
				y: 0,
			}
		}
	},
	watch: {
		modelValue: {
			handler(n) {
				this.dataList = this.modelValue;
				if (this.frist) {
					this.initXY();
					this.frist = false;
				}
			},
			deep: true
		},
	},
	mounted() {
		this.init();
	},
	methods: {
		// 点击图片
		imgC(obj) {
			this.$emit('imgClick', {
				name: obj.name,
				url: obj.url,
			});
		},
		// 删除
		dataListDel(index) {
			this.dataList.splice(index, 1);
			this.sortList();
		},
		// 选择图片
		uploadImg() {
			const msg = '最多上传'+this.count+'张图片。';
			if (this.dataList.length < this.count) {
				uni.chooseImage({
					count: this.count,
					sizeType: ['original'], // 上传原图
					success: (res) => {
						let pushDataTag = false; // msg是否提示
						res.tempFiles.forEach((item) => {
							if (this.dataList.length < this.count) {
								this.dataList.push({
									name: item.name,
									url: item.path,
								});
								this.initXY();
							} else {
								if (!pushDataTag) {
									uni.showToast({
										title: msg,
										duration: 3000,
										icon: "none"
									});
									pushDataTag = true;
								}
							}
						});
						const files = [];
						this.dataList.forEach((item) => {
							files.push({
								name: item.name,
								url: item.url,
							});
						});
						this.$emit('uploadFile', files);
					},
				});
			} else {
				uni.showToast({
					title: msg,
					duration: 3000,
					icon: "none"
				});
			}
		},
		init(){
			// 获取元素宽度
			const query = uni.createSelectorQuery().in(this);
			query.select('#moveBox').boundingClientRect(data => {
				this.moveBoxW = this.pxToRpx(data.width);
				this.moveBoxH = this.pxToRpx(data.height);
				this.initXY();
			}).exec();
		},
		getWindowInfo() {
			return uni.getWindowInfo();
		},
		// 拖 - 开始
		touchstart(item) {
			this.touchTime = {
				start: new Date().getTime(), // 开始
				end: null, // 结束
				time: 0, // 触摸时间
			};
			if (!item.moveEnd) {
				item.zIndex = 99;
				item.moveEnd = true;
				this.dataList.forEach((other) => {
					other.opacity = 0.6;
				});
				this.timer = setTimeout(() => {
					item.opacity = 1;
					clearTimeout(this.timer)
					this.timer = null
				}, 200)
			}
		},
		// 拖 - 结束
		touchend(item) {
			this.touchTime.end = new Date().getTime();
			this.touchTime.time = this.touchTime.end - this.touchTime.start;
			if (this.touchTime.time <= 100) return
			if (item.moveEnd) {
				item.zIndex = 1
				item.moveEnd = false
				item.opacity = 1
				if (this.moveIndex > this.dataList.length - 1) {
					this.moveIndex = this.dataList.length - 1;
				}
				const temp = item.sort;
				
				if (this.moveIndex !== null) {
					if (temp !== this.moveIndex) {
						// 互换排序
						item.sort = this.dataList[this.moveIndex].sort;
						this.dataList[this.moveIndex].sort = temp;
						// 互换原始值
						const oldx = item.oldx;
						const oldy = item.oldy;
						item.oldx = this.dataList[this.moveIndex].oldx;
						item.oldy = this.dataList[this.moveIndex].oldy;
						this.dataList[this.moveIndex].oldx = oldx;
						this.dataList[this.moveIndex].oldy = oldy;
						this.sortList();
					} else {
						// #ifdef MP-WEIXIN
						item.x += 1;
						setTimeout(() => {
							item.x -= 1;
						}, 200)
						// #endif
						// #ifndef MP-WEIXIN
						item.x = item.oldx;
						item.y = item.oldy;
						// #endif
					}
				}
				this.dataList.forEach((other) => {
					other.opacity = 1;
				});
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
				const oneItemW = (this.moveBoxW - (this.colCount - 1)*this.imgMargin)/this.colCount;
				// #ifdef MP-WEIXIN
				// #endif
				// #ifndef MP-WEIXIN
				item.x = x;
				item.y = y;
				// #endif
				if (e.detail.source === 'touch') {
					let moveX = 0; // 横向几个
					let moveY = 0; // 纵向几行
					const lieNum = Math.ceil((this.dataList.length + 1)/this.colCount);
					// 行
					for (let i = 1; i < this.colCount; i++) {
						if (this.pxToRpx(x) / (oneItemW*(i-0.5) + this.imgMargin*(i - 1)) >= 1) {
							moveX = i;
						}
					}
					// 列
					for (let i = 1; i < lieNum; i++) {
						if (this.pxToRpx(y) / ((this.imgHeight + this.imgMargin)*(i-0.5)) >= 1) {
							moveY = i;
						}
					}
					this.moveIndex = moveY*this.colCount + moveX;
				} else {
					this.moveIndex = null;
				}
			} else {
				// #ifdef MP-WEIXIN
				// #endif
				// #ifndef MP-WEIXIN
				item.x = item.oldx;
				item.y = item.oldy;
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
			// #ifdef H5
			this.initXY();
			// #endif
			// #ifndef H5
			setTimeout(() => {
				this.$nextTick(() => {
					this.initXY();
				});
			}, 0);
			// #endif
		},
		// 初始化元素的位置，根据dataList数组的数量计算
		initXY() {
			const oneItemW = (this.moveBoxW - (this.colCount - 1)*this.imgMargin)/this.colCount;
			const list = [];
			this.dataList.forEach((item, i) => {
				const x = i%this.colCount * (this.rpxToPx(oneItemW) + this.rpxToPx(this.imgMargin));
				const y = Math.floor(i/this.colCount) * this.rpxToPx(this.imgHeight + this.imgMargin);
				item.x = x;
				item.y = y;
				item.oldx = x;
				item.oldy = y;
				item.zIndex = 1; // 层级
				item.sort = i; // 排序
				item.opacity = 1; // 透明
				item.moveEnd = false; // 是否进入拖拽
				list.push(item);
			});
			this.dataList = JSON.parse(JSON.stringify(list));
			const i = this.dataList.length;
			const x = i%this.colCount * (this.rpxToPx(oneItemW) + this.rpxToPx(this.imgMargin));
			const y = Math.floor(i/this.colCount) * this.rpxToPx(this.imgHeight + this.imgMargin);
			this.add.x = x;
			this.add.y = y;
			
			this.$emit("update:modelValue", this.dataList);
		},
	}
}