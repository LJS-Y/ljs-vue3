// import API from "@/request/defect/index";
export default {
	data() {
		return {
			menuList: this.$store.getters.menuList,
			userinfo: undefined,
			// 字典
			// 基础数据
			baseData: {},
			// 表格搜索条件
			tableSearch: {
				query: {
					pageNum: 1,
					pageSize: 10,
				},
				queryReal: {}
			},
			// 表格
			table: {
				// 遮罩层
				loading: false,
				// 总条数
				total: 0,
				// 数据
				data: [],
			},
		}
	},
	onPullDownRefresh() {
		console.log('下拉');
		this.handleQuery();
	},
	onLoad(options) {
		// 来自于web-view的分享
		if (options.source === 'wxWebviewShare') {
			this.$ljsPublic.run.gp_navigateTo('/pages-other/WebView/WebView', {
				share: '1',
				url: options.url,
				queryStr: this.$ljsPublic.base.fieldCheck(options.queryStr) ? {} : options.queryStr,
			})
		}
		this.initData();
	},
	methods: {
		// 初始化数据
		async initData() {
			this.userinfo = this.$store.getters.userinfo;
			// this.handleQuery();
		},

		// 列表获取更多
		getListMore() {
			if (this.tableSearch.queryReal.pageNum * this.tableSearch.queryReal.pageSize < this.table.total) {
				this.$ljsPublic.msg.loading();
				this.tableSearch.queryReal.pageNum++;
				this.getList();
			}
		},
		/** 查询设备清单列表 */
		async getList() {
			this.table.loading = true;
			// const res = await API.list(this.tableSearch.queryReal);
			// if (res.code === 200) {
			// 	this.table.data = this.table.data.concat(res.rows);
			// 	this.table.total = res.total;
			// }
			// this.table.loading = false;
			this.$ljsPublic.msg.loading_close();
			setTimeout(() => {
				// 停止下拉刷新动画
				uni.stopPullDownRefresh();
			}, 300)
		},
		/** 搜索按钮操作 */
		handleQuery() {
			this.$ljsPublic.msg.loading();
			this.tableSearch.query.pageNum = 1;
			this.tableSearch.queryReal = this.$ljsPublic.base.deepCopy(this.tableSearch.query);
			delete this.tableSearch.queryReal.defectStatusIndex;
			this.table.data = [];
			this.getList();
		},
		/** 重置按钮操作 */
		resetQuery() {
			this.tableSearch = {
				query: {
					pageNum: 1,
					pageSize: 10,
					defectStatusIndex: 0,
				},
				queryReal: {}
			};
			this.handleQuery();
		},
		/** 刷新当前所有数据 */
		async refreshList() {
			this.$ljsPublic.msg.loading();
			this.table.data = [];
			const nums = this.tableSearch.queryReal.pageNum;
			for (let i = 1; i <= nums; i++) {
				this.tableSearch.queryReal.pageNum = i;
				await this.getList();
			}
		},
	}
}