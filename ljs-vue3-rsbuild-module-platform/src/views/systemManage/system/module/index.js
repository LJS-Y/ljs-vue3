import { list, info, listDel, listAdd, listEdit } from "@/api/systemManage/system/module";
import IconSelect from "@/components/IconSelect/index.vue";
export default {
  name: 'Module',
  components: { IconSelect },
  data() {
    return {
      // 字典
      sys_normal_disable: [],
      module_type: [],
      sys_open_type: [],
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
          moduleName: [
            { required: true, message: '请输入模块名称', trigger: 'blur' }
          ],
          moduleCode: [
            { required: true, message: '请输入模块编码', trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '请选择模式', trigger: 'change' }
          ],
          openType: [
            { required: true, message: '请选择模块打开方式', trigger: 'change' }
          ],
          icon: [
            { required: true, message: '点击选择图标', trigger: 'change' }
          ],
          imgUrl: [
            { required: true, message: '请选择引导图片', trigger: 'change' }
          ],
          sort: [
            { required: true, message: '请输入顺序', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择模块状态', trigger: 'change' }
          ],
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
    // 选择图标
    selected(name) {
      this.form.data.icon = name;
    },

    // 初始化数据
    async initData() {
      const res1 = await this.$dict.getDict('sys_normal_disable');
      if (res1) {
        this.sys_normal_disable = res1;
      }
      const res2 = await this.$dict.getDict('module_type');
      if (res2) {
        this.module_type = res2;
      }
      const res3 = await this.$dict.getDict('sys_open_type');
      if (res3) {
        this.sys_open_type = res3;
      }
      this.handleQuery();
    },

    /** 查询模块列表 */
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
    
    enableChange() {
      if (this.form.data.enable === '0') {
        delete this.form.rules.webUrl;
        this.form.rules.url = [
          { required: true, message: '请输入内部路径', trigger: 'blur' }
        ];
        this.form.rules.moduleType = [
          { required: true, message: '请选择模块类型', trigger: 'change' }
        ];
        this.form.data.moduleType = '1';
        this.form.data.openType = '1';
      } else if (this.form.data.enable === '1') {
        delete this.form.rules.url;
        delete this.form.rules.moduleType;
        this.form.rules.webUrl = [
          { required: true, message: '请输入外部链接', trigger: 'blur' }
        ];
        this.form.data.openType = '2';
      }
    },
    // 取消按钮
    cancel() {
      this.tc.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form.data = {
        enable: '0',
        status: '0',
        moduleType: '1',
        openType: '1',
        sort: '99',
      };
      this.enableChange();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.tc.open = true;
      this.tc.title = '添加模块';
      if (this.$refs['form']) {
        this.$refs['form'].resetFields();
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      info(row.id).then(async res => {
        if (res.code === 200) {
          this.form.data = res.data;
          this.tc.open = true;
          this.tc.title = '修改模块';
          if (this.$refs['form']) {
            this.$refs['form'].resetFields();
          }
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.butLoading = true;
          const query = this.$LJSbase.deepCopy(this.form.data);
          if (this.form.data.id != undefined) {
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
      const ids = row.id;
      const names = `${row.moduleName}（编码：${row.moduleCode}）`;
      this.$LJSEl.delMessageBox({
        message: `是否确认删除“${names}”的模块数据项？`,
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
      this.download('/wms/supplier/export', {
        ...this.tableSearch.queryReal
      }, `模块列表.xlsx`)
    }
  }
};