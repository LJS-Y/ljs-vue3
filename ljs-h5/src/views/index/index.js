import modules_ai from '@/router/modules/ai';

export default {
  name: "Index",
  data() {
    return {
      modules_aiData: modules_ai,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      
    },
    // 注销
    async logoutF() {
      this.$store.commit('loadingStore', {
        tag: true,
      });
      // await logout()
      this.$LJSsession.clearVuex(this.$store);
      this.$LJSsession.clearSS();
      this.$store.commit('loadingStore', {
        tag: false,
      });
      this.$run.replace({
        path: '/login'
      });
      this.$msg.info('用户已退出，请重新登录！');
    },
    
  }
};