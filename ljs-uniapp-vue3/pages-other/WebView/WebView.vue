<template>
  <web-view
	v-if="!$ljsPublic.base.fieldCheck(url)"
    :src="url"
    :webview-styles="{
      height: '100vh',
    }"
  />
</template>

<script>
	import WebView from './WebView.js'
	export default WebView
</script>

<style lang="scss" scoped>
	@import "./WebView.scss"; 
</style>

<!-- 
使用示例：
obj: {
  page: '/pages-other/WebView/WebView',
  query: {
    share: '0',
    url: 'http://192.168.3.61:9900/ai/index',
    queryStr: JSON.stringify({
      // token: userInfo.token, // token不需要额外添加
      id: 1
    }),
  },
}

proxy.$ljsPublic.run.gp_navigateTo(obj.page, !proxy.$ljsPublic.base.fieldCheck(obj.query) ? obj.query : {})
-->