import { listData, getData, delData, addData, updateData } from "@/api/systemManage/system/dict/data";
import { optionselect as getDictOptionselect, getType } from "@/api/systemManage/system/dict/type";

export default {
  name: "Data",
  data() {
    return {
      // 字典
      sys_normal_disable: [],
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字典表格数据
      dataList: [],
      // 默认字典类型
      defaultDictType: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 数据标签回显样式
      listClassOptions: [
        {
          value: "default",
          label: "默认"
        },
        {
          value: "primary",
          label: "主要"
        },
        {
          value: "success",
          label: "成功"
        },
        {
          value: "info",
          label: "信息"
        },
        {
          value: "warning",
          label: "警告"
        },
        {
          value: "danger",
          label: "危险"
        }
      ],
      // 类型数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictLabel: [
          { required: true, message: "数据标签不能为空", trigger: "blur" }
        ],
        dictValue: [
          { required: true, message: "数据键值不能为空", trigger: "blur" }
        ],
        dictSort: [
          { required: true, message: "数据顺序不能为空", trigger: "blur" }
        ]
      },
      // 节流阀
      butLoading: false,
    };
  },
  created() {
    const dictId = this.$route.params && this.$route.query.dictId;
    if (dictId) {
      this.initData(dictId);
    } else {
      this.handleClose();
    }
  },
  methods: {
    // 初始化数据
    async initData(dictId) {
      const res0 = await getType(dictId);
      if (res0.code === 200) {
        this.queryParams.dictType = res0.data.dictType;
        this.defaultDictType = res0.data.dictType;
      }
      const res1 = await this.$dict.getDict('sys_normal_disable');
      if (res1) {
        this.sys_normal_disable = res1;
      }
      this.getTypeList();
      this.getList();
    },
    /** 查询字典类型列表 */
    getTypeList() {
      getDictOptionselect().then(res => {
        if (res.code === 200) {
          this.typeOptions = res.data;
        }
      });
    },
    /** 查询字典数据列表 */
    getList() {
      this.loading = true;
      listData(this.queryParams).then(res => {
        if (res.code === 200) {
          this.dataList = res.rows;
          this.total = res.total;
        }
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictCode: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        cssClass: undefined,
        listClass: 'default',
        dictSort: 0,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 返回按钮操作 */
    handleClose() {
      this.$run.replace({
        path: '/systemManage/system/dict'
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.dictType = this.defaultDictType;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典数据";
      this.form.dictType = this.queryParams.dictType;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictCode)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictCode = row.dictCode || this.ids
      getData(dictCode).then(res => {
        if (res.code === 200) {
          this.form = res.data;
          this.open = true;
          this.title = "修改字典数据";
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.butLoading = true;
          if (this.form.dictCode != undefined) {
            updateData(this.form).then(res => {
              if (res.code === 200) {
                // this.$store.dispatch('dict/removeDict', this.queryParams.dictType);
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
              this.butLoading = false;
            });
          } else {
            addData(this.form).then(res => {
              if (res.code === 200) {
                // this.$store.dispatch('dict/removeDict', this.queryParams.dictType);
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
              this.butLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictCodes = row.dictCode || this.ids;
      this.$LJSEl.delMessageBox({
        message: '是否确认删除字典编码为"' + dictCodes + '"的数据项？',
        doSomething: () => {
          this.$store.commit('loadingStore', {
            tag: true,
            text: '删除中....'
          });
          delData(dictCodes).then((res) => {
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
      this.download('system/dict/data/export', {
        ...this.queryParams
      }, `data_${new Date().getTime()}.xlsx`)
    }
  }
};