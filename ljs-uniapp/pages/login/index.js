import { getMenu } from "@/tools/menu.js"
export default {
	data() {
		return {
      // 基础数据
      baseData: {
				technical_support: this.$CONFIG.technical_support,
			},
			// 登录表单
      loginForm: {
        username: '',
        password: '',
        type: 'account'
      },
			// 记住密码
			rememberPassword: false,
		}
	},
	onLoad() {
		this.init();
	},   
	methods: {
		// 登录接口
		async login() {
			if (this.$ljsPublic.base.fieldCheck(this.loginForm.username)) {
				this.$ljsPublic.msg.msg('请输入用户名');
				return;
			}
			if (this.$ljsPublic.base.fieldCheck(this.loginForm.password)) {
				this.$ljsPublic.msg.msg('请输入密码');
				return;
			}
			this.$ljsPublic.msg.loading();
			// 记住用户名和密码
			if (this.rememberPassword) {
				uni.setStorageSync('ljs_uniapp_rememberPassword', this.rememberPassword);
				uni.setStorageSync('ljs_uniapp_username', this.loginForm.username);
				uni.setStorageSync('ljs_uniapp_password', this.loginForm.password);
			} else {
				uni.removeStorageSync('ljs_uniapp_rememberPassword');
				uni.removeStorageSync('ljs_uniapp_username');
				uni.removeStorageSync('ljs_uniapp_password');
			}
			// 登录
			const res1 = await this.$API.common.login(this.loginForm);
			if (res1.code === 200) {
				this.$store.commit('SET_token', res1.token);
				uni.setStorageSync('ljs_uniapp_token', res1.token);
				// 获取用户信息
				const res2 = await this.$API.common.getInfo();
				if (res2.code === 200) {
					// 处理用户头像
					let avatar = res2.user.avatar;
					const defaultSrc = '/static/images/common/head.png';
					avatar = this.$ljsPublic.base.fieldCheck(avatar) ? defaultSrc : this.$CONFIG.base_url + avatar;
					res2.user.avatar = avatar;
					// 存储用户、模块
					this.$store.commit('SET_userinfo', res2.user);
					
					const menus = getMenu();
					this.$store.commit('SET_menuList', menus);
					// 默认显示第一个菜单
					uni.setStorageSync('ljs-bottom-menu', 0);
					const url = menus[0].url;
					this.$ljsPublic.run.gp_reLaunch(url);
					this.$ljsPublic.msg.loading_close();
					return;
				}
			}
			uni.clearStorageSync();
			this.$store.commit('RESET_STORE');
			this.$ljsPublic.msg.loading_close();
		},
		
		init() {
			// #ifdef MP-WEIXIN
			this.$base.initShare('/pages/login/index');
			// #endif
			const rememberPassword = uni.getStorageSync('ljs_uniapp_rememberPassword');
			if (rememberPassword === true) {
				const username = uni.getStorageSync('ljs_uniapp_username');
				const password = uni.getStorageSync('ljs_uniapp_password');
				this.loginForm.username = username;
				this.loginForm.password = password;
				this.rememberPassword = rememberPassword;
			}
		},
		rememberPasswordF() {
			this.rememberPassword = !this.rememberPassword;
		},
	},  
}