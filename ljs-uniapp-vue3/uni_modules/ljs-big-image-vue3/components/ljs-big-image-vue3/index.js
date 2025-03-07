export default {
	name: 'BigImage',
	props: {
		// 是否显示
		modelValue: Boolean,
		// 图片地址
		path: String,
		// 图片标题。默认为null，不展示标题。
		title: {
			type: String,
			default: null,
		},
		// 宽度
		width: {
			type: String,
			default: '730rpx',
		},
		// 高度
		height: {
			type: String,
			default: '70%',
		},
		// 圆角
		borderRadius: {
			type: String,
			default: '20rpx',
		},
		// z-index
		zIndex: {
			type: [Number],
			default: 200,
		},
	},
	data() {
		return {
			scaleNum: 1, // 放大倍数
		};
	},
	watch: {
		modelValue: {
			handler(val) {
				if (this.modelValue) {
					this.scaleNum = 1;
				}
			},
			deep: true,
			immediate: true
		},
	},
	created() {
		this.init();
	},
	methods: {
		handleTouchStart(event) {
			if (event.touches.length === 2) {
				this.startTouches = [...event.touches];
			}
		},
		handleTouchMove(event) {
			if (event.touches.length === 2) {
				const endTouches = [...event.touches];
				const startDistance = this.calculateDistance(this.startTouches[0], this.startTouches[1]);
				const endDistance = this.calculateDistance(endTouches[0], endTouches[1]);
				const scale = endDistance / startDistance;

				// 放大或缩小操作
				// 这里可以根据需要进行处理，比如应用到某个样式或者调用方法
				const scaleNum = scale.toFixed(2);
				this.scaleNum = scaleNum;

				// this.startTouches = [...endTouches];
			}
		},
		handleTouchEnd(event) {
			if (event.touches.length < 2) {
				this.startTouches = [];
			}
			this.scaleNum = this.scaleNum < 1 ? 1 : this.scaleNum;
		},
		calculateDistance(touch1, touch2) {
			const x1 = touch1.pageX;
			const y1 = touch1.pageY;
			const x2 = touch2.pageX;
			const y2 = touch2.pageY;
			return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
		},
		init() {},
		close() {
			this.$emit("update:modelValue", false);
		},
	}
};