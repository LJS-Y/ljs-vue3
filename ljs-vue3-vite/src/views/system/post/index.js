import { list, info, listDel, listAdd, listEdit } from "@/api/system/post.js";

export default {
  name: "Post",
  data() {
    return {
      // 字典
      sys_normal_disable: [],
      // 基础数据
      baseData: {
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
      // 表格搜索条件
      tableSearch: {
        query: {
          pageNum: 1,
          pageSize: 10,
        },
        queryReal: {}
      },
      // 操作
      operate: {
        // 选中数组 - 删除标识
        ids: [],
        // 选中数组 - 删除显示名
        names: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
      },
      // 弹窗
      tc: {
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
      },
      // 表单
      form: {
        // 校验
        rules: {
          postName: [
            { required: true, message: "岗位名称不能为空", trigger: "blur" }
          ],
          postCode: [
            { required: true, message: "岗位编码不能为空", trigger: "blur" }
          ],
          postSort: [
            { required: true, message: "岗位顺序不能为空", trigger: "blur" }
          ],
          status: [
            { required: true, message: "请选择岗位状态", trigger: "change" }
          ]
        },
        // 数据
        data: {},
        // 节流阀
        butLoading: false,
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    // 初始化数据
    async initData() {
      const res1 = await this.$dict.getDict('sys_normal_disable');
      if (res1) {
        this.sys_normal_disable = res1;
      }
      this.getList();
    },

    /** 查询客户列表 */
    getList() {
      this.table.loading = true;
      list(this.tableSearch.queryReal).then(res => {
        if (res.code === 200) {
          this.table.data = res.rows;
          this.table.total = res.total;
        }
        this.table.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.tableSearch.query.pageNum = 1;
      this.tableSearch.queryReal = this.$LJSbase.deepCopy(this.tableSearch.query);
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.tableSearch = {
        query: {
          pageNum: 1,
          pageSize: 10,
        },
        queryReal: {}
      };
      this.handleQuery();
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.operate.names = [];
      this.operate.ids = selection.map(item => {
        this.operate.names.push(item.postName);
        return item.postId;
      })
      this.operate.single = selection.length!=1
      this.operate.multiple = !selection.length
    },
    // 表单重置
    reset() {
      this.form.data = {
        postSort: 0,
        status: "0",
      };
    },
    // 取消按钮
    cancel() {
      this.tc.open = false;
      this.reset();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.tc.open = true;
      this.tc.title = '添加岗位';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      info(row.postId).then(async res => {
        if (res.code === 200) {
          this.form.data = res.data;
          this.tc.open = true;
          this.tc.title = '修改岗位';
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const query = this.$LJSbase.deepCopy(this.form.data);
          this.form.butLoading = true;
          if (this.form.data.postId != undefined) {
            listEdit(query).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess('修改成功');
                this.tc.open = false;
                this.getList();
              }
              this.form.butLoading = false;
            });
          } else {
            listAdd(query).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess('新增成功');
                this.tc.open = false;
                this.getList();
              }
              this.form.butLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.postId || this.operate.ids;
      const names = row.postName || this.operate.names;
      this.$LJSEl.delMessageBox({
        title: '系统提示',
        message: `是否确认删除“${names}”的数据项？`,
        doSomething: () => {
          this.$store.commit('loadingStore', {
            tag: true,
            text: '删除中....'
          });
          listDel(ids).then((res) => {
            if (res.code === 200) {
              this.getList();
              this.$modal.msgSuccess('删除成功');
            }
            this.$store.commit('loadingStore', {
              tag: false,
              text: '删除中....'
            });
          }).catch(()=>{
            this.$store.commit('loadingStore', {
              tag: false,
              text: '删除中....'
            });
          });
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/post/export', {
        ...this.tableSearch.queryReal
      }, `岗位.xlsx`)
    }
  }
};