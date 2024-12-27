import API from "@/request/system/user";
export default {
	data() {
		return {
			menuList: this.$store.getters.menuList,
			edition: 'v' + this.$ljsPublic.base.getAppBaseInfo().appVersion,
			email: this.$CONFIG.email,
			currentSize: 0, // 缓存
			
			// 修改密码 - 弹窗
			editPassword_tc: {
			  // 弹出层标题
			  title: '',
			  // 是否显示弹出层
			  open: false,
			},
			// 修改密码 - 表单
			editPassword_form: {
			  // 数据
			  data: {},
			  // 节流阀
			  butLoading: false,
			},
			
			// 修改头像 - 弹窗
			editHeadpic_tc: {
			  // 弹出层标题
			  title: '',
			  // 是否显示弹出层
			  open: false,
			},
			// 修改头像 - 表单
			editHeadpic_form: {
			  // 数据
			  data: {},
			  // 节流阀
			  butLoading: false,
			},
			
			// 图片放大显示
			bigImage: {
			  // 是否显示弹出层
			  open: false,
				// 图片地址
				path: '',
			},
		}
	},
	onLoad() {
		this.init();
	},
	methods: {
		// 复制
		addQq(val) {
			uni.setClipboardData({
				data: val,
				success: () => {
					this.$ljsPublic.msg.msg_success("复制成功！");
				}
			});
		},
		clear() {
			uni.showModal({
				title: '温馨提示',
				content: '清除缓存操作将会清除所有程序存储在本地设备的缓存数据，您确定要清除吗？',
				success: (res) => {
					if (res.confirm) {
						uni.clearStorageSync();
						this.$store.commit('RESET_STORE');
						this.$ljsPublic.msg.msg("缓存已清除！");
						this.$ljsPublic.run.gp_reLaunch('/pages/login/index');
					}
				}
			});
		},
		init() {
			this.getHC();
		},
		// 获取缓存大小
		getHC() {
			const res = uni.getStorageInfoSync();
			this.currentSize = this.kbDataChange(res.currentSize, 1);
		},
		kbDataChange(data, position = 2) {
			try {
				let num = Number(data);
				if (num < 1024) {
					return num + "KB";
				} else if (num >= 1024 && num < 1024 * 1024) {
					return (num / 1024).toFixed(position) + "MB";
				} else if (num >= 1024 * 1024) {
					return (num / (1024 * 1024)).toFixed(position) + "TB";
				}
			} catch {
				console.warn("该方法需要传输数字，请检查您的参数是否正确！")
			}
			return data;
		},
		
		// 修改密码 - 取消按钮
		editPasswordCancel() {
			this.editPassword_tc.open = false;
			this.editPasswordReset();
		},
		// 表单重置
		editPasswordReset() {
			this.editPassword_form.data = {};
		},
		// 修改密码 - 打开
		editPasswordOpen() {
			this.editPasswordReset();
			this.editPassword_tc.title = '修改密码';
			this.editPassword_tc.open = true;
		},
		/** 修改密码 - 提交按钮 */
		editPasswordSubmitForm: function() {
			if (this.$ljsPublic.base.fieldCheck(this.editPassword_form.data.oldPassword)) {
				this.$ljsPublic.msg.msg(`请输入旧密码`);
				return;
			}
			if (this.$ljsPublic.base.fieldCheck(this.editPassword_form.data.newPassword)) {
				this.$ljsPublic.msg.msg(`请输入新密码`);
				return;
			}
			if (this.$ljsPublic.base.fieldCheck(this.editPassword_form.data.confirmPassword) || this.editPassword_form.data.newPassword !== this.editPassword_form.data.confirmPassword) {
				this.$ljsPublic.msg.msg(`确认密码与新密码不一致，请重新输入`);
				this.editPassword_form.data.newPassword = '';
				this.editPassword_form.data.confirmPassword = '';
				return;
			}
			this.editPassword_form.butLoading = true;
			API.updateUserPwd(this.editPassword_form.data.oldPassword, this.editPassword_form.data.newPassword).then(res => {
				if (res.code === 200) {
					this.$ljsPublic.msg.msg_success(`修改成功`);
					this.editPasswordCancel();
				} else {
					this.editPasswordReset();
				}
				this.editPassword_form.butLoading = false;
			});
		},
		
		imgClick(imgList) {
			if (imgList.length > 0) {
				this.bigImage.path = imgList[0].url;
				this.bigImage.open = true;
			}
		},
		// 修改头像 - 取消按钮
		editHeadpicCancel() {
			this.editHeadpic_tc.open = false;
			this.editHeadpicReset();
		},
		// 表单重置
		editHeadpicReset() {
			this.editHeadpic_form.data = {
				imgList: [],
			};
		},
		// 修改头像 - 打开
		editHeadpicOpen() {
			this.editHeadpicReset();
			API.getUserProfile().then((res) => {
				if (res.code === 200) {
					this.editHeadpic_tc.title = '修改头像';
					this.editHeadpic_tc.open = true;
					if (!this.$ljsPublic.base.fieldCheck(res.data.avatar)) {
						this.editHeadpic_form.data.imgList = [{
							url: this.$CONFIG.base_url + res.data.avatar
						}];
					}
				}
			});
		},
		/** 修改头像 - 提交按钮 */
		editHeadpicSubmitForm: function() {
			this.editHeadpic_form.butLoading = true;
			this.$ljsPublic.msg.loading();
			API.uploadAvatar(this.editHeadpic_form.data.imgList[0].url).then((res) => {
				if (res.code === 200) {
					let avatar = res.imgUrl;
					const defaultSrc = '/static/images/common/head.png';
					avatar = this.$ljsPublic.base.fieldCheck(avatar) ? defaultSrc : this.$CONFIG.base_url + avatar;
					const userinfo = this.$store.getters.userinfo;
					userinfo.avatar = avatar;
					this.$store.commit('SET_userinfo', userinfo);
					
					this.$ljsPublic.msg.msg_success(`已修改`);
					this.editHeadpicCancel();
				}
				this.editHeadpic_form.butLoading = false;
				this.$ljsPublic.msg.loading_close();
			});
		},
	},
}