export default {
  name: 'LjsBottomMenu',
	data() {
		return {
			menuList: [],
			// 当前选中第几个菜单
			butTag: 0,
			useOpts: {
				fontColor: '#333', // 字体颜色
				fontActiveColor: '#5c70fe', // 选中字体颜色
				fontSize: '20rpx', // 字体大小
				menuBgColor: '#FFF', // 菜单背景颜色
				menuShadowColor: 'rgb(0, 0, 0, .2)', // 菜单上边沿颜色
			},
		}
	},
	props: {
		// 菜单数据
    data: Array,
    // 默认选中菜单的索引值。如当前路由非菜单中的路由，传-1。
    defaultIndex: {
      type: Number,
      default: 0
    },
    // 菜单样式参数
    opts: {
      type: Object,
      default: () => {
				return {};
			}
    },
    // 特殊按钮的处理函数
		specialButtonF: {
      type: Function,
      default: () => {
				return () => {};
			}
    },
	},
  watch: {
    data: {
      handler(val) {
				if (this.data.length > 0) {
					this.init();
				}
      },
      deep: true,
      immediate: true
    },
  },
	created() {
	},
	methods: {
		// 跳转
		goPage(index, row1, row2){
			if (!this.fieldCheck(row2)) {
				// 标记菜单选中
				this.butTag = index;
				uni.setStorageSync('ljs-bottom-menu', index);
				const url = row2.url;
				const parameter = row2.parameter;
				uni.redirectTo({
					url: this.getUrl(url, parameter)
				});
				return;
			}
			if (!this.fieldCheck(row1) && !this.fieldCheck(row1.children) && row1.children.length > 0) {
				this.setLevel2Show(row1.ljsId);
				return;
			}
			if (index === -1) {
				return;
			}
			let menuIndex = uni.getStorageSync('ljs-bottom-menu');
			const pages = getCurrentPages();
			let nowPage = null;
			if (pages.length > 0) {
				nowPage = pages[pages.length - 1];
				if (menuIndex === index && this.menuList[index].url.search(nowPage.route) > -1) {
					return;
				}
			}
			// 标记菜单选中
			this.butTag = index;
			uni.setStorageSync('ljs-bottom-menu', index);
			
			const url = this.menuList[index].url;
			const parameter = this.menuList[index].parameter;
			uni.redirectTo({
				url: this.getUrl(url, parameter)
			});
		},
		setLevel2Show(ljsId, level2Show = false) {
			this.menuList.forEach((item) => {
				if (ljsId === item.ljsId) {
					item.level2Show = !item.level2Show;
				} else {
					item.level2Show = false;
				}
			})
		},
		
		getUrl(url, parms) {
			// 合并链接的参数到参数体里
			let list = this.analysisUrl(url);
			
			if(parms === undefined){
				parms = {}
			}
			for(let key in list[1]){
				parms[key] = list[1][key];
			}
			
			let parmsStr = "";
			parmsStr += "?"
			for(let key in parms){
				parmsStr += key + "=" + parms[key] + "&"
			}
			parmsStr = parmsStr.substring(0, parmsStr.length - 1);
			return list[0] + parmsStr;
		},
		analysisUrl(url) {
			if(url.indexOf("?") > -1){
				let urls = url.split("?");
				let parms = urls[1].split("&");
				let obj = {};
				parms.forEach((item)=>{
					let p = item.split("=");
					obj[p[0]] = p[1];
				});
				return [urls[0], obj];
			}
			return [url, {}];
		},
		
		init(){
			// 处理参数
			for (let key in this.opts) {
				this.useOpts[key] = this.opts[key];
			}
			// 查看缓存
			let menuIndex = uni.getStorageSync('ljs-bottom-menu');
			if(menuIndex === undefined || menuIndex === null || menuIndex === ''){
				this.butTag = this.defaultIndex;
				uni.setStorageSync('ljs-bottom-menu', this.butTag);
			}else{
				this.butTag = menuIndex;
			}
			// 处理原始数据
			this.menuList = [];
			let ljsId = 0;
			this.data.forEach((item) => {
				const temp = JSON.parse(JSON.stringify(item));
				temp.ljsId = `ljs${ljsId}`;
				ljsId++;
				if (!this.fieldCheck(item.children) && item.children.length > 0) {
					item.children.forEach((c) => {
						c.ljsId = `ljs${ljsId}`;
						ljsId++;
					});
				}
				temp.level2Show = false;
				this.menuList.push(temp);
			});
			// #ifdef MP-WEIXIN
			// 微信无刷新
			// this.goPage(this.butTag);
			// #endif
		},
		fieldCheck(field) {
		  if (field === undefined || field === null || field === '') {
		    return true;
		  }
		  return false;
		},
	}
}