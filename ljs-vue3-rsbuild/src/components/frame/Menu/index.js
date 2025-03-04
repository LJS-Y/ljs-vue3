export default {
  name: 'CMenu',
  props: {
		// 菜单数据
		modelValue: Array,
    // 是否收起
    shrink: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuList: this.modelValue,
      // 菜单
      menu: {
        list: [], // 菜单基础数据 - 路由获取
        choose: null, // 菜单 - 当前打开对象
        tabList: [], // 菜单 - tab数据集
        tabListW: 0, // 菜单 - tab数据集所占元素长度
        tabListJtShow: false, // 菜单 - tab数据集左右箭头是否存在
        tabBoxMove: 0, // 菜单 - tabBox移动距离
        shrink: false // 菜单是否收起
      },
      win_h: 300, // 窗口高度
      menuC2_h: 300 // 收缩后菜单高度
    };
  },
  watch: {
    shrink: function () {
      if (this.shrink) {
        this.$refs.menuShrink.classList.value = 'menuZJ shrink';
      } else {
        this.$refs.menuShrink.classList.value = 'menuZJ shrink_open';
      }
    },
    modelValue: {
			handler(n) {
        this.menuList = this.modelValue;
			},
			deep: true
		},
    menuList: {
			handler(n) {
        this.$emit('update:modelValue', this.menuList);
			},
			deep: true
		},
  },
  created() {
    this.init();
  },
  methods: {
    // 菜单点击方法
    menuCF(item) {
      this.$LJSmenu.menuControl({store: this.$store, run: this.$run, menuObj: item});
    },
    init() {
      this.menu.choose = this.$store.getters.menuNowOpen;
      this.win_h = document.documentElement.clientHeight;
      const maxC2H = this.win_h - 64;
      if (maxC2H < 300) {
        this.menuC2_h = maxC2H;
      }
    }
  }
};
