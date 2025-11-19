import {
  login,
  getInfo,
  getCodeImg
} from '@/api/common/login.js';
import { LJSws } from 'ljs-tools'
export default {
  name: 'Login',
  data() {
    return {
      projectName: import.meta.env.PUBLIC_PROJECT_NAME,
      copyrightName: import.meta.env.PUBLIC_COMPANY_OWNER,
      codeUrl: '',
      cookiePassword: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        type: 'account'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入您的账号' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入您的密码' }
        ],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      // 验证码开关
      captchaOnOff: import.meta.env.PUBLIC_CAPTCHA_ON_OFF === '1',
      // 注册开关
      register: false,
    };
  },
  created() {
    if (this.captchaOnOff) {
      this.getCode();
    }
    this.getSession();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = 'data:image/gif;base64,' + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getSession() {
      const username = this.$LJSsession.getLS('username');
      const password = this.$LJSsession.getLS('password');
      const rememberMe = this.$LJSsession.getLS('rememberMe');
      this.loginForm = {
        username: username === null ? this.loginForm.username : username,
        password: password === null ? this.loginForm.password : this.$LJScryptoJs.getDES(password),
        rememberMe: rememberMe === null ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.$store.commit('loadingStore', {
            tag: true,
            text: '加载中....'
          });
          if (this.loginForm.rememberMe) {
            this.$LJSsession.setLS('username', this.loginForm.username);
            this.$LJSsession.setLS('password', this.$LJScryptoJs.setDES(this.loginForm.password));
            this.$LJSsession.setLS('rememberMe', this.loginForm.rememberMe);
          } else {
            this.$LJSsession.delLS('username');
            this.$LJSsession.delLS('password');
            this.$LJSsession.delLS('rememberMe');
          }
          // 登录
          const res1 = await login(this.loginForm);
          if (res1 && res1.code === 200) {
            this.$store.commit('SET_token', res1.token);
            // 获取用户信息
            const res2 = await getInfo();
            if (res2.code === 200) {
              // 处理用户头像
              let avatar = res2.user.avatar;
              avatar = (avatar == "" || avatar == null) ? this.$em.errorImage_head : import.meta.env.PUBLIC_API_URL + avatar;
              res2.user.avatar = avatar;
              // 存储用户、权限
              this.$store.commit('SET_userinfo', res2.user);
              this.$store.commit('SET_permissions', res2.permissions);
              this.$store.commit('SET_roles', res2.roles);
              // 获取菜单
              const res3 = await this.$store.dispatch('GenerateRoutes');
              if (res3) {
                this.$LJSmenu.fristOpenMenu(this.$store);
                const menuNowOpen = this.$store.state.menuNowOpen;
                // console.log('监测路由是否存在', this.$router.hasRoute(menuNowOpen.name));
                if (menuNowOpen.url) {
                  this.$run.replace({
                    path: menuNowOpen.url
                  });
                  return;
                } else {
                  this.$modal.msgWarning('您的暂无权限访问本系统，请联系管理员为您分配权限。');
                }
              }
            }
          }
          this.$LJSsession.clearVuex(this.$store);
          if (this.captchaOnOff) {
            this.getCode();
          }
          this.$store.commit('loadingStore', {
            tag: false,
            text: '加载中....'
          });
        }
      });
    }
  }
};