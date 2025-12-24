import ico_close from './images/close.png';
export default {
	name: 'ljs-dialog-vue3',
	props: {
		modelValue: Boolean,
		// 弹窗标题。headerShow为true时有效。
		title: String,
		// 弹窗标题：字号。
		titleFontSize: {
			type: Number,
			default: 28,
		},
		// 弹窗标题栏高度，单位upx。默认90，最小为90。headerShow为true时有效。
		setTitleHeight: {
			type: Number,
			default: 90,
		},
		// 弹窗宽度
		width: {
			type: String,
			default: '90%',
		},
		// 裸露圆角值
		borderRadius: {
			type: Number,
			default: 20,
		},
		// 弹框背景
		background: {
			type: String,
			default: '#FFF',
		},
		// 遮罩背景
		shadeBackground: {
			type: String,
			default: 'rgba(0, 0, 0, .6)',
		},
		// 点击遮罩是否关闭弹窗
		shadeClose: {
			type: Boolean,
			default: true,
		},
		// z-index
		zIndex: {
			type: [Number, String],
			default: 100,
		},
		// 是否显示头部区域
		headerShow: {
			type: Boolean,
			default: true,
		},
		// 是否显示关闭按钮
		closeButShow: {
			type: Boolean,
			default: true,
		},
		// 关闭按钮图片
		closeImg: {
			type: String,
			default: ico_close,
		},
		// 是否限制弹窗最大高度
		tcMaxHeightTag: {
			type: Boolean,
			default: true,
		},
		// 是否直接按照tcMaxHeightProportion的值设置高度占比。tcMaxHeightTag为true有效。
		tcMaxHeightUseTag: {
			type: Boolean,
			default: false,
		},
		// 限制弹窗最大高度占比，建议不大于1。
		tcMaxHeightProportion: {
			type: [Number],
			default: 0.8,
		},
	},
	data() {
		return {
			box_h: 'auto',
			overflow_y: 'auto',
			contentH: 'auto',
			contentMaxH: 'auto',
			titleHeight: 90,
		};
	},
	watch: {
		modelValue: {
			handler(val) {
				if (this.modelValue) {
					this.init();
				}
			},
			deep: true,
			immediate: true
		}
	},
	created() {},
	methods: {
		init() {
			if (this.setTitleHeight > 90) {
				this.titleHeight = this.setTitleHeight;
			}
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.ljs-dialog-vue3-box').boundingClientRect(data => {
					if (data) {
						const real_h = data.height;
						const win_h = uni.getWindowInfo().screenHeight;
						let box_h = win_h * this.tcMaxHeightProportion;
						if (box_h > real_h) {
							if (!this.tcMaxHeightUseTag) {
								box_h = real_h;
							}
							this.overflow_y = 'hidden';
						}
						this.box_h = box_h + 'px';
						setTimeout(() => {
							this.$emit('openAfter');
						}, 0)
					}
				}).exec();
			});
		},
		close() {
			this.$emit('closeBefore');
			this.$emit('update:modelValue', false);
			setTimeout(() => {
				this.$emit('closeAfter');
			}, 0)
		},
	}
};