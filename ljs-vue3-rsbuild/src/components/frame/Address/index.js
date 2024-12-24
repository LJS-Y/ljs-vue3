export default {
  name: 'Address',
  props: {
  },
  data() {
    return {
      // 菜单
      menu: {
        choose: null, // 菜单 - 当前打开对象
      }
    };
  },
  watch: {
    // 监听导航变化
    '$store.getters.menuNowOpen': {
			handler(n) {
        this.init();
			},
			deep: true
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.menu.choose = this.$store.getters.menuNowOpen;
    }
  }
};
