import ico_back from '../static/images/ico_back.png'
import ico_back_000 from '../static/images/ico_back_000.png'
import ico_home from '../static/images/ico_home.png'
import ico_home_000 from '../static/images/ico_home_000.png'
export default {
	data() {
		return {
			statusBarHeight: 0, // 状态按钮高度
			myback: {
				// 是否显示返回按钮，默认显示
				show: false,
				// imgUrl类型值。''/'000'
				imgTag: '',
				// 返回按钮的图片地址
				imgUrl: ico_back,
				// 回退的步数。
				backNum: 1,
				// home图标指向。用于getCurrentPages().length === 1 时的处理地址。通常用于二级页面分享后快速回到首页。
				homePath: '/pages/index/index',
				// 回退方式，true为默认方法，false为消息传递方法
				backFTag: true,
				// 回退所传递的消息。backFTag: false时可自定义
				msg: null,
				// 回退回调函数的函数名，用于接收msg内容。backFTag: false时可用
				backFunName: 'ljs_top_backF',
			},
			// top样式
			topStyle: {},
			bgColorOrImage: {
				height: 0, // 参数bgColorOrImageHeight的高度应用值
				width: '100%',
				tag: false, // 高度是否已经进入变化期，用于恢复的动画状态
				tagHeight: 0, // tag为true时，记录最后一个值，用于false后的恢复过程。
			},
			// 页面数量
			pagesTotal: 0,
			timer: null,
		}
	},
	props: {
		// 标题内容
		title: String,
		// title层透明度
		titleOpacity: {
			type: Number,
			default: 1,
		},
		// 标题颜色
		titleColor: {
			type: String,
			default: '#FFFFFF',
		},
		// 标题字重
		titleWeight: {
			type: Number,
			default: 400,
		},

		// 返回按钮相关配置
		back: {
			type: Object,
			default: function() {
				return {}
			},
		},
		// 背景颜色，支持渐变色，如：linear-gradient(to top right, #CDDC39, #8BC34A, #FFEB3B);
		backgroundColor: {
			type: String,
			default: '#004799',
		},
		// 开启背景图片，未开启，使用背景颜色，开启backgroundImage为必填项
		backgroundImageShow: {
			type: Boolean,
			default: false,
		},
		// 背景图片地址，使用前需配置backgroundImageShow为true。
		backgroundImage: String,
		// 背景图片透明度，使用前需配置backgroundImageShow为true。
		backgroundImageOpacity: {
			type: Number,
			default: 1,
		},
		// 组件高度（除状态栏）
		topHeight: {
			type: Number,
			default: 80,
		},
		// 背景颜色或背景图片的高度，默认等于topHeight。false时禁用该功能。当IOS设备下拉时出现空白区域，我们希望背景同步衍生，达到较好的视觉效果，可使用该参数。
		bgColorOrImageHeight: {
			type: [Number, Boolean],
			default: false,
		},
		// 标题高度
		titleHeight: {
			type: Number,
			default: 80,
		},
	},
	watch: {
		bgColorOrImageHeight: {
			handler(val) {
				if (this.bgColorOrImageHeight !== false) {
					if (this.bgColorOrImageHeight > this.topHeight) {
						if (!this.bgColorOrImage.tag) {
							this.bgColorOrImage.tag = true;
						}
						this.bgColorOrImage.height = this.bgColorOrImageHeight;
						this.bgColorOrImage.tagHeight = this.bgColorOrImageHeight;
						this.bgColorOrImage.width = (750 / this.topHeight) * this.bgColorOrImage.height + 'rpx';
					} else {
						this.bgColorOrImage.tag = false;
						this.bgColorOrImageWithdraw();
					}
				} else {
					this.bgColorOrImage.height = this.topHeight;
					this.bgColorOrImage.width = '100%';
				}
			},
			immediate: true,
		},
	},
	mounted() {
		this.init()
	},
	beforeMount() {
		if (this.timer !== null) {
			clearInterval(this.timer)
		}
	},
	methods: {
		bgColorOrImageWithdraw() {
			if (this.bgColorOrImage.tagHeight > this.topHeight) {
				const step = 6;
				this.timer = setInterval(() => {
					if (this.bgColorOrImage.height - step <= this.topHeight) {
						this.bgColorOrImage.height = this.topHeight;
						this.bgColorOrImage.width = '100%';
						clearInterval(this.timer)
						return;
					}
					this.bgColorOrImage.height -= step
					this.bgColorOrImage.width = (750 / this.topHeight) * this.bgColorOrImage.height + 'rpx';
				}, 3)
			} else {
				this.bgColorOrImage.height = this.topHeight;
				this.bgColorOrImage.width = '100%';
			}
		},
		backF() {
			if (this.myback.backFTag) {
				if (this.pagesTotal <= 1) {
					uni.reLaunch({
						url: this.myback.homePath,
					})
				} else {
					uni.navigateBack({
						delta: this.myback.backNum,
					})
				}
			} else {
				const parms = this.myback.msg
				if (this.pagesTotal <= 1) {
					uni.reLaunch({
						url: this.myback.homePath,
						success:() => {
							if (parms !== null) {
								let pages = getCurrentPages();
								pages[pages.length - 1].$vm[this.myback.backFunName](parms) // 给上一页绑定方法gp_navigateBackF,传参数
							}
						}
					});
				} else {
					let pages = null // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
					let prevPage = null //上一页页面实例
					const num = this.myback.backNum
					if (parms !== null) {
						pages = getCurrentPages()
						prevPage = pages[pages.length - (num + 1)]
					}
					uni.navigateBack({
						delta: num,
						success: () => {
							if (parms !== null) {
								prevPage.$vm[this.myback.backFunName](parms) // 给上一页绑定方法gp_navigateBackF,传参数
							}
						},
					})
				}
			}
		},
		init() {
			this.pagesTotal = getCurrentPages().length;
			// #ifndef MP
			if (this.backgroundImageShow) {
				this.topStyle = {
					'background-image': 'url(' + this.backgroundImage + ')',
					'background-repeat': 'no-repeat',
					backgroundSize: '100% 100%',
					opacity: this.backgroundImageOpacity,
				}
			} else {
				this.topStyle = {
					background: this.backgroundColor,
					opacity: this.backgroundImageOpacity,
				}
			}
			// #endif
			this.statusBarHeight = this.getWindowInfo().statusBarHeight
			for (let key in this.back) {
				this.myback[key] = this.back[key];
			}
			
			// 通常非首页分享后只有一个页面栈，后退按钮应该修改为home按钮
			if (this.pagesTotal <= 1) {
				this.myback.imgUrl = this.myback.imgTag !== '000' ? ico_home : ico_home_000;
			} else {
				this.myback.imgUrl = this.myback.imgTag !== '000' ? ico_back : ico_back_000;
			}
		},
		getWindowInfo() {
			return uni.getWindowInfo()
		},
	},
}