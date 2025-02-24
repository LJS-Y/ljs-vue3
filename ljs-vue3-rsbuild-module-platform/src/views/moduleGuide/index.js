import { BallSwiper } from 'ball-swiper';
export default {
  name: 'ModuleGuide',
  data() {
    return {
      projectName: import.meta.env.PUBLIC_PROJECT_NAME,
      copyrightName: import.meta.env.PUBLIC_COMPANY_OWNER,
      copyright: import.meta.env.PUBLIC_RECORD_NUMBER,
      // 模块
      module: {
        data: [], // 原始数据
      }
    };
  },
  components: {
    BallSwiper
  },
  mounted() {
    const modules = this.$store.getters.modules;
    this.module.data = modules;
  },
  methods: {
    // 注销
    logoutF() {
      this.$LJSsession.clearVuex(this.$store);
      this.$LJSsession.clearSS();
      this.$run.replace({
        path: '/login'
      });
      this.$message.info('用户已退出，请重新登录！');
    },
  }
};