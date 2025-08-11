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
		const title = !this.$LJSbase.fieldCheck(this.optionsTemp.shareText) ? this.optionsTemp.shareText : this.$CONFIG.base_url;
		const imageUrl = !this.$LJSbase.fieldCheck(this.optionsTemp.shareImg) ? idForFile(this.optionsTemp.shareImg) : null
		const urlAndQuery = this.$LJSurl.getUrlAllParameter(this.url)
		let path = `pages/index/index`
		if (!this.$LJSbase.fieldCheck(urlAndQuery)) {
			path = `pages/index/index?source=wxWebviewShare&share=${this.$LJSbase.fieldCheck(this.optionsTemp.share) ? 0 : this.optionsTemp.share}&url=${urlAndQuery[0]}&queryStr=${JSON.stringify(urlAndQuery[1])}`
		}
		return {
			title,
			imageUrl,
			path,
		}
	},
	methods: {}
}