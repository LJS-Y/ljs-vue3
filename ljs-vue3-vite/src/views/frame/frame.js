import screenfull from 'screenfull';
import Menu from '@/components/frame/Menu/index.vue';
import Address from '@/components/frame/Address/index.vue';
export default {
  data() {
    return {
      projectName: import.meta.env.VITE_PROJECT_NAME,
      userinfo: '', // 用户信息
      headUrl: '',
      // 皮肤
      skin: {
        value: 'default', // 显示的皮肤值
      },
      // 模块级菜单
      moduleMenu: {
        width: 0, // 可视区域宽度
        data: [], // 数据
        showData: [], // 可视区域可显示的数据
        hideData: [], // 可视区域未显示的数据
      },
      // 菜单
      menu: {
        list: [], // 菜单基础数据 - 路由获取
        choose: null, // 菜单 - 当前打开对象
        chooseIndex: null, // 菜单 - 当前打开对象的索引
        tabList: [], // 菜单 - tab数据集
        tabListW: 0, // 菜单 - tab数据集所占元素长度
        tabListJtShow: false, // 菜单 - tab数据集左右箭头是否存在
        tabBoxMove: 0, // 菜单 - tabBox移动距离
        shrink: false, // 菜单是否收起
        // 右键菜单
        rightMenu: {
          show: false, // 显示
          menuChoose: 1, // 1.自己；2.其他；
          i: undefined, // 选中的索引
          obj: undefined, // 选中的菜单对象
          opts: {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
          }
        },
      },
      // 控制
      control: {
        full: false, // 全屏
        pageAnimation: true // 页面动画控制
      }
    };
  },
  components: {
    Menu,
    Address
  },
  computed: {
    // 需要缓存的组件
    keepAliveList() {
      const list = [];
      this.$store.getters.menuOpenList.forEach((item) => {
        list.push(item.name);
      });
      return list;
    }
  },
  watch: {
    // 浏览器窗口宽度变化监听
    '$store.getters.screenWidth': {
			handler(n) {
        this.getModuleMenu();
        this.updateData();
			},
			deep: true
    },
    // 当前打开页卡变化监听 - 更新数据。
    '$store.getters.menuNowOpen': {
			handler(n) {
        if (this.$store.getters.userinfo !== null) {
          this.getChooseMenuIndex();
          this.updateData();
          this.pageAnimation();
        }
			},
			deep: true
		}
  },
  mounted() {
    this.init();
  },
  methods: {
    // 用户详情页面
    goUserInfo() {
      const item = {
        title: '个人中心',
        name: 'EditUserInfo',
        url: '/editUserInfo',
        icon: 'user',
        // 获取菜单文字导航数据address
      };
      // 跳转数据未更新。
      this.$LJSmenu.menuControl({store: this.$store, run: this.$run, menuObj: item}); // 自主跳转
    },
    // 去住应用
    goMainApp() {
      location.href = import.meta.env.VITE_APP_GO_HOME
    },
    // 注销
    logoutF() {
      this.$LJSsession.clearVuex(this.$store);
      this.$LJSsession.clearSS();
      this.$run.replace({
        path: '/login'
      });
      this.$message.info('用户已退出，请重新登录！');
    },
    // tab页签 - tabControl - mouseenter
    tabControlIconAddClassName(name) {
      this.$refs[name].classList.value = 'icon hover';
    },
    // tab页签 - tabControl - mouseleave
    tabControlIconRemoveClassName(name) {
      this.$refs[name].classList.value = 'icon leave';
    },
    // 全屏功能
    fullscreen() {
      if (!screenfull.isEnabled) {
        this.$notification.open({
          message: '温馨提示',
          description:
            '您的浏览器无法使用全屏功能，请更换谷歌浏览器或者请手动点击F11按钮全屏展示！',
          duration: 10,
          placement: 'bottomLeft'
        });
        return;
      }
      screenfull.toggle();
      if (screenfull.isFullscreen) {
        this.control.full = false;
      } else {
        this.control.full = true;
      }
    },
    // 换肤按钮
    changeSkin(theme) {
      this.skin.value = theme;
      this.$store.commit('SET_frameTheme', theme);
      this.$LJSsession.setLS('FRAME_THEME', theme);
    },
    // 左侧菜单收缩
    menuShrink() {
      this.menu.shrink = !this.menu.shrink;
      this.$store.commit('SET_menuShrink', this.menu.shrink);
      if (this.menu.shrink) {
        this.$refs.menuShrink.classList.value = 'menu shrink';
        this.$refs.mainShrink.classList.value = 'main shrink';
      } else {
        this.$refs.menuShrink.classList.value = 'menu shrink_open';
        this.$refs.mainShrink.classList.value = 'main shrink_open';
      }
      this.updateData();
    },
    // tab关闭按钮点击
    tabClose(index, choose) {
      if (choose) {
        let tab = null;
        if (index === 0) {
          tab = this.menu.tabList[index + 1];
        } else {
          tab = this.menu.tabList[index - 1];
        }
        this.tabCF(tab);
      }
      this.menu.tabList.splice(index, 1);
      this.$store.commit('SET_menuOpenList', this.menu.tabList);
      this.updateData();
    },
    // 移动TabBox
    moveTabBox(tag) {
      // 计算单步距离
      const span = this.menu.tabList.length > 0 ? (this.menu.tabList[0].title.length * 14 + 64 + 5) : 0;
      // 可移动距离
      const boxW = this.$refs.tabsMidd.offsetWidth - this.menu.tabListW;
      if (tag < 0) {
        if ((this.menu.tabBoxMove + span) < 0) {
          this.menu.tabBoxMove += span;
        } else {
          this.menu.tabBoxMove = 0;
        }
      } else {
        if ((this.menu.tabBoxMove - span) > boxW) {
          this.menu.tabBoxMove -= span;
        } else {
          this.menu.tabBoxMove = boxW;
        }
      }
    },
    // tab点击
    tabCF(tab) {
      if (this.menu.choose.url === tab.url) {
        return;
      }
      this.menu.choose = tab;
      this.$store.commit('SET_menuNowOpen', this.menu.choose);
      this.updateMenuDataChooseState(this.menu.choose);
      
      // 恢复展开状态。保留用户刷新前最后的菜单操作状态。
      const parents = this.$LJSbase.getTreeParents({
        data: this.menu.list,
        value: tab.menuId,
        key: 'menuId'
      });
      this.$LJSmenu.updateTreeOpen({menuList: this.menu.list, parents});
      
      this.$run.push({
        path: tab.url
      });
    },
    // 获取打开页签的索引
    getChooseMenuIndex() {
      const nums = this.menu.tabList.length;
      for (let i = 0; i < nums; i++) {
        const item = this.menu.tabList[i];
        if (item.url === this.menu.choose.url) {
          this.menu.chooseIndex = i;
          return;
        }
      }
      this.menu.chooseIndex = null;
    },
    // 右键菜单
    rightMenu($event, i, item) {
      const mouse_x = $event.clientX;
      this.menu.rightMenu = {
        show: true,
        menuChoose: item.url === this.menu.choose.url ? 1 : 2,
        i: i,
        obj: item,
        opts: {
          left: mouse_x,
          top: 114,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      };
      return false;
    },
    // 页面跳转动画
    pageAnimation() {
      this.control.pageAnimation = false;
      setTimeout(() => {
        this.control.pageAnimation = true;
      }, 300);
    },
    // 点击菜单 - 更新整个菜单的choose状态
    updateMenuDataChooseState(chooseMenu) {
      this.menuChooseChange(this.menu.list, chooseMenu);
    },
    // choose处理
    menuChooseChange(list, chooseMenu) {
      list.forEach((item) => {
        if ((chooseMenu.level ? item.level === chooseMenu.level : true) && item.url === chooseMenu.url) {
          item.choose = true;
        } else {
          item.choose = false;
          this.menuChooseChange(item.children, chooseMenu);
        }
      });
    },
    // tab页签 - mouseenter
    addClassName(name, index, tab) {
      if (this.menu.choose.url === tab.url) {
        return;
      }
      this.$refs[name][index].classList.value = 'one hover';
    },
    // tab页签 - mouseleave
    removeClassName(name, index, tab) {
      if (this.menu.choose.url === tab.url) {
        return;
      }
      this.$refs[name][index].classList.value = 'one';
    },
    // 计算tabsBox的宽度
    calcTabsBox() {
      const win_ratio = this.$LJSbase.getWindowRatio();
      this.menu.tabListW = 0;
      this.menu.tabList.forEach((item) => {
        const nameW = item.title.length * 14;
        this.menu.tabListW += nameW + 64 + 5;
      });
      this.menu.tabListW -= 5;
      if (win_ratio < 100) {
        this.menu.tabListW += 1 * this.menu.tabList.length;
      }
      if (win_ratio <= 67) {
        this.menu.tabListW += 1 * this.menu.tabList.length;
      }
      if (win_ratio <= 40) {
        this.menu.tabListW += 2 * this.menu.tabList.length;
      }
      this.menu.tabListJtShow = this.$refs.tabsMidd.offsetWidth < this.menu.tabListW;
      if (!this.menu.tabListJtShow) {
        this.menu.tabBoxMove = 0;
      }
    },
    // 初始化
    init() {
      this.skin.value = this.$base.initSkin(); 
      this.userinfo = this.$store.getters.userinfo;
      const defaultSrc = this.$base.getImageUrl('images/common/head.png');
      this.headUrl = this.userinfo.headUrl && this.userinfo.headUrl !== '' && this.userinfo.headUrl !== null ? this.userinfo.headUrl : defaultSrc;
      setTimeout(() => {
        this.getModuleMenu();
      }, 200);
      this.menu.list = this.$store.getters.menuList;
      // 菜单是否收起
      this.menu.shrink = this.$store.getters.menuShrink;
      if (this.menu.shrink) {
        this.$refs.menuShrink.classList.value = 'menu shrink';
        this.$refs.mainShrink.classList.value = 'main shrink';
      } else {
        this.$refs.menuShrink.classList.value = 'menu shrink_open';
        this.$refs.mainShrink.classList.value = 'main shrink_open';
      }
      this.updateData();
      this.getChooseMenuIndex();
    },

    // tab关闭 - 重置
    tabReset() {
      this.menu.rightMenu.i = undefined;
      this.menu.rightMenu.obj = undefined; 
      this.getChooseMenuIndex();
    },
    // tab关闭 - 刷新
    // tabCloseRefresh() {
    //   if (this.menu.rightMenu.obj) {
    //     this.$run.replace({
    //       path: this.menu.rightMenu.obj.url, query: { t: Date.now() }
    //     })
    //   }
    // },
    // tab关闭 - 当前
    tabCloseChoose() {
      if (this.menu.rightMenu.i !== undefined && this.menu.rightMenu.obj !== undefined) {
        this.tabClose(this.menu.rightMenu.i, this.menu.choose.url === this.menu.rightMenu.obj.url);
        this.updateData();
      } else {
        this.tabClose(this.menu.chooseIndex, true);
        this.updateData();
      }
      this.tabReset();
    },
    // tab关闭 - 左边
    tabCloseLeft() {
      const tabList = this.menu.tabList;
      const nums = tabList.length;
      let index = 0;
      let choose = false; // 被关闭的标签是否有当前被打开项
      for (let i = 0; i < nums; i++) {
        if (
          (this.menu.rightMenu.obj !== undefined && this.menu.tabList[i].url === this.menu.rightMenu.obj.url) ||
          (this.menu.rightMenu.obj === undefined && this.menu.tabList[i].url === this.menu.choose.url)
        ) {
          index = i;
          break;
        }
        if (this.menu.tabList[i].url === this.menu.choose.url) {
          choose = true;
        }
      }
      this.menu.tabList = tabList.slice(index, tabList.length);
      this.$store.commit('SET_menuOpenList', this.menu.tabList);
      if (choose) {
        this.$run.push({
          path: this.menu.rightMenu.obj.url
        })
        this.$store.commit('SET_menuNowOpen', this.menu.rightMenu.obj);
      }
      this.updateData();
      this.tabReset();
    },
    // tab关闭 - 右边
    tabCloseRight() {
      const tabList = this.menu.tabList;
      const nums = tabList.length;
      let index = 0;
      let choose = false; // 被关闭的标签是否有当前被打开项
      for (let i = 0; i < nums; i++) {
        if (
          (this.menu.rightMenu.obj !== undefined && this.menu.tabList[i].url === this.menu.rightMenu.obj.url) ||
          (this.menu.rightMenu.obj === undefined && this.menu.tabList[i].url === this.menu.choose.url)
        ) {
          index = i;
          break;
        }
        if (this.menu.tabList[i].url === this.menu.choose.url) {
          choose = true;
        }
      }
      this.menu.tabList = tabList.slice(0, index + 1);
      this.$store.commit('SET_menuOpenList', this.menu.tabList);
      if (
        (this.menu.rightMenu.obj !== undefined && !choose) ||
        (this.menu.rightMenu.obj === undefined && choose)
      ) {
        this.$run.push({
          path: this.menu.rightMenu.obj.url
        });
        this.$store.commit('SET_menuNowOpen', this.menu.rightMenu.obj);
      }
      this.updateData();
      this.tabReset();
    },
    // tab关闭 - 其他
    tabCloseOther() {
      this.menu.tabList = [this.menu.choose];
      this.$store.commit('SET_menuOpenList', this.menu.tabList);
      this.updateData();
      this.tabReset();
    },
    // tab关闭 - 全部
    tabCloseAll() {
      this.$LJSmenu.fristOpenMenu(this.$store);
      const menuNowOpen = this.$store.state.menuNowOpen;
      this.$run.push({
        path: menuNowOpen.url
      })
      this.updateData();
      this.tabReset();
    },

    // 更新数据
    updateData() {
      this.menu.choose = this.$store.getters.menuNowOpen;
      this.updateMenuDataChooseState(this.menu.choose);
      this.menu.tabList = this.$store.getters.menuOpenList;
      this.calcTabsBox();
      // 定位光标
      let numL = 0; // 左走
      let numR = 0; // 右走
      const tabList = this.menu.tabList;
      const nums = tabList.length;
      for (let i = 0; i < nums; i++) {
        numR += tabList[i].title.length * 14 + 64 + 5;
        if (this.menu.choose.url === tabList[i].url) {
          break;
        }
        numL += tabList[i].title.length * 14 + 64 + 5;
      }
      const tabsMidd = this.$refs.tabsMidd.offsetWidth;
      if ((Math.abs(this.menu.tabBoxMove) > numL)) {
        this.menu.tabBoxMove = (-1) * numL;
      }
      if (tabsMidd < numR) {
        // 可移动距离
        const boxW = this.$refs.tabsMidd.offsetWidth - this.menu.tabListW;
        if ((this.menu.tabBoxMove + (tabsMidd - numR)) > boxW) {
          this.menu.tabBoxMove += tabsMidd - numR;
        } else {
          this.menu.tabBoxMove = boxW;
        }
      }
    },
    // 模块级菜单
    // 浏览器大小变化需重新计算
    getModuleMenu() {
      // 如果需要模块功能可放行
      return;
      this.$nextTick(() => {
        // 模块级菜单 - 模拟数据
        this.moduleMenu = {
          width: 0, // 可视区域宽度
          data: [], // 数据
          showData: [], // 可视区域可显示的数据
          hideData: [], // 可视区域未显示的数据
        };
        for (let i = 0; i < 5; i++) {
          this.moduleMenu.data.push({
            name: `模块级菜单${i + 1}`,
            url: '',
            icon: '',
          });
        }
        let moduleMenuW = 0;
        const userInfoBoxW = this.$refs.userInfoBox.offsetWidth; // 用户信息区域宽度
        this.moduleMenu.width = document.documentElement.clientWidth - userInfoBoxW - 300; // 展示区域的宽度
        const moduleMenuIcoW = 21; // icon宽度
        const moduleMenuPaddingW = 31; // padding宽度
        const moduleMenuMoreW = 46; // more宽度
        const nums = this.moduleMenu.data.length;
        for (let i = 0; i < nums; i++) {
          const item = this.moduleMenu.data[i];
          // item宽度
          const moduleMenuItemW = moduleMenuIcoW + item.name.length * 14 + moduleMenuPaddingW;
          const nextW = moduleMenuW + moduleMenuItemW + moduleMenuMoreW; // 未来宽度
          if (nextW > this.moduleMenu.width) {
            this.moduleMenu.hideData.push(item);
          } else {
            this.moduleMenu.showData.push(item);
            moduleMenuW += moduleMenuItemW;
          }
        }
      });
    }
  }
};
