import { webView } from "@/tools/common.js";
export default {
	data() {
		return {
			url: null,
			optionsTemp: null,
		}
	},
	onLoad(options) {
		this.optionsTemp = options;
		this.url = webView(options);
	},
	onShareAppMessage() {
		const title = this.$CONFIG.base_url;
		const urlAndQuery = this.$ljsPublic.url.getUrlAllParameter(this.url)
		let path = `pages/index/index`
		if (!this.$ljsPublic.base.fieldCheck(urlAndQuery)) {
			path = `pages/index/index?source=wxWebviewShare&share=${this.$ljsPublic.base.fieldCheck(this.optionsTemp.share) ? 0 : this.optionsTemp.share}&url=${urlAndQuery[0]}&queryStr=${JSON.stringify(urlAndQuery[1])}`
		}
		return {
			title,
			path,
		}
	},
	methods: {}
}