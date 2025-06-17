<template>
	<view class="comFrame">
		<ljs-top-vue3
			title="设置"
			backgroundColor="linear-gradient(to right, #0968e3, #084AA1)"
			titleColor="#FFF"
			:back="{ show: false }">
			<!-- #ifndef MP-WEIXIN -->
			<view @click="$com.logout()" class="logout">
				<text class="iconfont icon-farenzhuxiao"></text>
			</view>
			<!-- #endif -->
		</ljs-top-vue3>
		
		<view class="comMain" :style="{
			height: 'calc(100% - 80rpx - '+ $ljsPublic.base.getTopStateHeight() +'px)',
		}">
			<view class="comPage">
				<view class="menuList">
					<view class="one" @click="editPasswordOpen">
						<text class="ico iconfont icon-mima1"></text>
						<view class="text">修改密码</view>
						<text class="jt iconfont icon-jiantouyou"></text>
					</view>
					<view class="one" @click="editHeadpicOpen">
						<text class="ico iconfont icon-morentouxiang"></text>
						<view class="text">修改头像</view>
						<text class="jt iconfont icon-jiantouyou"></text>
					</view>
				</view>
				
				<view class="menuList">
					<view class="one" @click="clear">
						<text class="ico iconfont icon-qinglihuancun"></text>
						<view class="text">清除缓存<text class="num">{{currentSize}}</text></view>
						<text class="jt iconfont icon-jiantouyou"></text>
					</view>
					<view class="one" @click="addQq(email)">
						<text class="ico iconfont icon-email"></text>
						<view class="text">联系我<text class="num">E-mail：{{email}}</text></view>
						<text class="jt iconfont icon-jiantouyou"></text>
					</view>
				</view>
				
				<view class="menuList">
					<view class="one">
						<text class="ico iconfont icon-wenhao-xianxingyuankuang"></text>
						<view class="text" style="width: calc(100% - 90upx);">版本<text class="num">{{edition}}</text></view>
					</view>
				</view>
				
				<!-- #ifdef MP-WEIXIN -->
				<view class="menuList">
					<view class="one" @click="$com.logout()">
						<text class="ico iconfont icon-logout"></text>
						<view class="text">退出登录</view>
						<text class="jt iconfont icon-jiantouyou"></text>
					</view>
				</view>
				<!-- #endif -->
			</view>
		</view>
		
		<ljs-bottom-menu-vue3
			:data="menuList">
		</ljs-bottom-menu-vue3>
		
		<!-- 修改密码 -->
		<ljs-dialog-vue3 :title="editPassword_tc.title" v-model="editPassword_tc.open" class="comTc">
			<view class="comForm">
				<view class="one">
					<view class="label">旧密码：</view>
					<view class="inputBox">
						<input v-model="editPassword_form.data.oldPassword" class="input" type="password" placeholder="旧密码">
						<text @click="!$ljsPublic.base.fieldClean(editPassword_form.data, 'oldPassword')" class="iconfont icon-guanbi1" v-if="!$ljsPublic.base.fieldCheck(editPassword_form.data.oldPassword)"></text>
					</view>
				</view>
				<view class="one">
					<view class="label">新密码：</view>
					<view class="inputBox">
						<input v-model="editPassword_form.data.newPassword" class="input" type="password" placeholder="新密码">
						<text @click="!$ljsPublic.base.fieldClean(editPassword_form.data, 'newPassword')" class="iconfont icon-guanbi1" v-if="!$ljsPublic.base.fieldCheck(editPassword_form.data.newPassword)"></text>
					</view>
				</view>
				<view class="one">
					<view class="label">确认密码：</view>
					<view class="inputBox">
						<input v-model="editPassword_form.data.confirmPassword" class="input" type="password" placeholder="确认密码">
						<text @click="!$ljsPublic.base.fieldClean(editPassword_form.data, 'confirmPassword')" class="iconfont icon-guanbi1" v-if="!$ljsPublic.base.fieldCheck(editPassword_form.data.confirmPassword)"></text>
					</view>
				</view>
			</view>
			<view class="operate" style="margin-top: 0;">
				<view class="but" @click="!editPassword_form.butLoading ? editPasswordSubmitForm() : () => {}">确定</view>
				<view class="but grey" @click="editPasswordCancel()">取消</view>
			</view>
		</ljs-dialog-vue3>
		
		<!-- 修改头像 -->
		<ljs-dialog-vue3 :title="editHeadpic_tc.title" v-model="editHeadpic_tc.open" class="comTc">
			<view class="comForm">
				<view class="one">
					<view class="label">头像：</view>
					<view class="imgValue">
						<ljs-dragImages-vue3
							v-model="editHeadpic_form.data.imgList"
							:touchTarg="false"
							:count="1"
							:colCount="2"
							:imgHeight="200"
							:imgRadius="10"
							@imgClick="imgClick(editHeadpic_form.data.imgList)"
							>
						</ljs-dragImages-vue3>
					</view>
				</view>
			</view>
			<view class="operate" style="margin-top: 0;">
				<view class="but" @click="!editHeadpic_form.butLoading ? editHeadpicSubmitForm() : () => {}">确定</view>
				<view class="but grey" @click="editHeadpicCancel()">取消</view>
			</view>
		</ljs-dialog-vue3>
		
		<ljs-big-image-vue3
			v-model="bigImage.open"
			:path="bigImage.path"
			:zIndex="1000">
		</ljs-big-image-vue3>
	</view>
</template>

<script>
	import index from './index.js'
	export default index
</script>

<style lang="scss" scoped>
	@import "./index.scss"; 
</style>
