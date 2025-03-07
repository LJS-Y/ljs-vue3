import ico_back from '../static/images/ico_back.png';
export default {
	data() {
		return {
			statusBarHeight: 0, // 状态按钮高度
			myback: {
				// 是否显示返回按钮，默认显示
				show: true,
				// 返回按钮的图片地址
				imgUrl: ico_back,
				// 回退的步数。
				backNum: 1,
				// 回退方式，true为默认方法，false为消息传递方法
				backFTag: true,
				// 回退所传递的消息。backFTag: false时可自定义
				msg: null,
				// 回退回调函数的函数名，用于接收msg内容。backFTag: false时可用
				backFunName: 'ljs_top_backF',
			},
			// top样式
			topStyle: {}
		}
	},
	props: {
		// 标题内容
		title: String,
		// 标题颜色
		titleColor: {
			type: String,
			default: '#FFFFFF'
		},
		// 返回按钮相关配置
		back: {
			type: Object,
			default: function() {
				return {}
			}
		},
		// 背景颜色，支持渐变色，如：linear-gradient(to top right, #CDDC39, #8BC34A, #FFEB3B);
		backgroundColor: {
			type: String,
			default: '#004799'
		},
		// 开启背景图片，未开启，使用背景颜色，开启backgroundImage为必填项
		backgroundImageShow: {
			type: Boolean,
			default: false
		},
		// 背景图片地址，使用前需配置backgroundImageShow为true。
		backgroundImage: String,
		// 组件高度（除状态栏）
		topHeight: {
			type: Number,
			default: 80
		},
		// 标题高度
		titleHeight: {
			type: Number,
			default: 80
		},
	},
	mounted() {
		this.init();
	},
	methods: {
		backF () {
			if (this.myback.backFTag) {
				uni.navigateBack({
					delta: this.myback.backNum
				});
			} else {
				let pages = null; // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
				let prevPage = null; //上一页页面实例
				const parms = this.myback.msg;
				const num = this.myback.backNum;
				if (parms !== null) {
					pages = getCurrentPages();
					prevPage = pages[pages.length - (num + 1)];
				}
				uni.navigateBack({
					delta: num,
					success:() => {
						if (parms !== null) {
							prevPage.$vm[this.myback.backFunName](parms) // 给上一页绑定方法gp_navigateBackF,传参数
						}
					}
				});
			}
					// $ljsPublic.run.gp_navigateBack(1, {
					// 	code: 200,
					// 	msg: '保存成功'
					// })
		},
		init() {
			// #ifdef MP-WEIXIN
			// #endif
			// #ifndef MP-WEIXIN
			if (this.backgroundImageShow) {
				this.topStyle = {
					'background-image': 'url('+this.backgroundImage+')',
					'background-repeat': 'no-repeat',
					backgroundSize: '100% 100%'
				}
			} else {
				this.topStyle = {
					'background': this.backgroundColor
				}
			}
			// #endif
			this.statusBarHeight = this.getWindowInfo().statusBarHeight;
			for (let key in this.back) {
				this.myback[key] = this.back[key];
			}
		},
		getWindowInfo() {
			return uni.getWindowInfo();
		}
	}
}
