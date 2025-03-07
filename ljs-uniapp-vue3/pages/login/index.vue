<template>
	<view class="login">
		<view class="logo">
			<image class="pic" src="../../static/images/logo.png"></image>
		</view>
		<view class="loginBox">
			<view class="one">
				<view class="name">用户名：</view>
				<view class="input">
					<input v-model="loginForm.username" type="text" />
					<text @click="!$ljsPublic.base.fieldClean(loginForm, 'username')" class="iconfont icon-guanbi1"
						v-if="!$ljsPublic.base.fieldCheck(loginForm.username)"></text>
				</view>
			</view>
			<view class="one">
				<view class="name">密&#12288;码：</view>
				<view class="input">
					<input v-model="loginForm.password" type="password" password />
					<text @click="!$ljsPublic.base.fieldClean(loginForm, 'password')" class="iconfont icon-guanbi1"
						v-if="!$ljsPublic.base.fieldCheck(loginForm.password)"></text>
				</view>
			</view>
			<view class="rememberPassword" @click="rememberPasswordF">
				<checkbox :checked="rememberPassword" style="transform:scale(0.6)" />记住密码
			</view>
			<view @click="login" class="but">登录</view>
		</view>
		<view class="copyright">
			技术支持：{{ baseData.technical_support }}
		</view>
	</view>
</template>

<script>
	import index from './index.js'
	export default index
</script>

<style lang="scss" scoped>
	@import "./index.scss";
</style>