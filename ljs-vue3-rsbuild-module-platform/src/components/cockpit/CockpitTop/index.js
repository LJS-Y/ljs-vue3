export default {
  props: {
  },
  data() {
    return {
      projectName: import.meta.env.PUBLIC_PROJECT_NAME,
      datetime: {
        value: '-年-月-日 -:-:-',
        timer: null
      },
      backOpen: false,
    };
  },
  watch: {
    $route: {
      handler(val) {
        this.backOpen = this.$route.path !== '/cockpit';
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.getTime();
      this.datetime.timer = setInterval(() => {
        this.getTime();
      }, 1000);
    },
    // 当前时间
    getTime() {
      const date = new Date();
      this.datetime.value = this.$LJSdate.formatTime(date.getTime(), `{y}年{m}月{d}日 {h}:{i}:{s}`);
    },
    // 去住应用
    goMainApp() {
      this.$run.goExternalUrl(import.meta.env.PUBLIC_GO_HOME, '_self');
    },
  }
};