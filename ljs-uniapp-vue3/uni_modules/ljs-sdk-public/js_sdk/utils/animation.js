/** 
 * @module animation
 * @description 动画封装，根据自己的需求自行修改该文件
 *  */

/**
 * 初始化
 * @param {Object} option createAnimation基础参数
 * @param {Number} option.duration 动画持续时间，单位ms
 * @param {String} option.timingFunction 定义动画的效果[linear, ease, ease-in, ease-in-out, ease-out, step-start, step-end]
 * @param {Number} option.delay 动画延迟时间，单位 ms
 * @returns {String} 返回createAnimation
 * @example init()
 * */
export function init(option = {
	duration: 500, // 动画持续时间，单位ms
	timingFunction: 'ease', // 定义动画的效果
	delay: 0, // 动画延迟时间，单位 ms
}) {
	return uni.createAnimation(option)
}

/**
 * dome1
 * @param {Object} option createAnimation基础参数
 * @param {Number} option.duration 动画持续时间，单位ms
 * @param {String} option.timingFunction 定义动画的效果[linear, ease, ease-in, ease-in-out, ease-out, step-start, step-end]
 * @param {Number} option.delay 动画延迟时间，单位 ms
 * @returns {String} 返回createAnimation
 * @example
HTML:
<view :animation="animationData" style="background:red;height:100rpx;width:100rpx"></view>
JS:
export default {
	data() {
		return {
			form: {
				animationData: {}
			}
		}
	},
	onLoad() {
		this.animationData = this.$ljsPublic.animation.dh_xzfd(this.animationData);
	}
}
 * */
export function animation1(option) {
	let animation = init(option);
	animation.opacity(1).scale(1.5,1.5).rotate(360).step()
	animation.opacity(0.8).scale(0.8,0.8).rotate(0).step()
	return animation.export();
}


export default {
	animation1
};
