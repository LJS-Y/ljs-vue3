import {
  login,
  getInfo,
  getCodeImg
} from '@/api/common/login';
import errorHead from '@/assets/images/common/head.png';
export default {
  name: 'Login',
  data() {
    return {
      projectName: import.meta.env.PUBLIC_PROJECT_NAME,
      copyrightName: import.meta.env.PUBLIC_COMPANY_OWNER,
      copyright: import.meta.env.PUBLIC_RECORD_NUMBER,
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
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // this.getCode();
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
              avatar = (avatar == "" || avatar == null) ? errorHead : import.meta.env.PUBLIC_API_URL + avatar;
              res2.user.avatar = avatar;
              // 存储用户、模块
              this.$store.commit('SET_userinfo', res2.user);
              res2.modules.forEach((item) => {
                item.imgUrl = import.meta.env.PUBLIC_API_URL + item.imgUrl;
              });
              this.$store.commit('SET_modules', res2.modules);
              this.$run.replace({
                path: '/moduleGuide'
              });
              return;
            }
          }
          this.$LJSsession.clearVuex(this.$store);
          this.$store.commit('loadingStore', {
            tag: false,
            text: '加载中....'
          });
        }
      });
    }
  }
};