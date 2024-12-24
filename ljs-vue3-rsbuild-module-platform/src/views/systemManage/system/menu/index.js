import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/systemManage/system/menu";
import { listNo } from "@/api/systemManage/system/module";
import IconSelect from "@/components/IconSelect/index.vue";

export default {
  name: "Menu",
  components: { IconSelect },
  data() {
    return {
      h: 0,
      // 字典
      sys_show_hide: [],
      sys_normal_disable: [],
      // 基础数据
      baseData: {
        // 模块
        module: [],
        moduleCode: undefined,
      },
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" }
        ]
      },
      // 节流阀
      butLoading: false,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    // 初始化数据
    async initData() {
      this.h = document.documentElement.clientHeight - 108;
      await this.getModule();
      const res1 = await this.$dict.getDict('sys_show_hide');
      if (res1) {
        this.sys_show_hide = res1;
      }
      const res2 = await this.$dict.getDict('sys_normal_disable');
      if (res2) {
        this.sys_normal_disable = res2;
      }
    },
    async getModule() {
      const res = await listNo();
      if (res.code === 200) {
        this.baseData.module = res.data;
        if (this.baseData.module.length > 0) {
          this.baseData.id = this.baseData.module[0].id;
          this.getList();
        } else {
          this.$modal.msgWarning('暂无模块信息，数据异常，请联系系统管理员。');
        }
      }
    },
    moduleC(item) {
      this.baseData.id = item.id;
      this.getList();
    },

    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      const query = this.$LJSbase.deepCopy(this.queryParams);
      query.moduleId = this.baseData.id;
      listMenu(query).then(res => {
        if (res.code === 200) {
          this.menuList = this.handleTree(res.data, "menuId");
          this.loading = false;
        }
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu({
        moduleId: this.baseData.id
      }).then(res => {
        if (res.code === 200) {
          this.menuOptions = [];
          const menu = { menuId: 0, menuName: '主类目', children: [] };
          menu.children = this.handleTree(res.data, "menuId");
          this.menuOptions.push(menu);
        }
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
        moduleId: this.baseData.id,
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: "M",
        orderNum: undefined,
        isFrame: "1",
        isCache: "0",
        visible: "0",
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        menuName: undefined,
        visible: undefined
      };
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      this.form.parentId = [0];
      if (row != null && row.menuId) {
        const parents = this.$LJSbase.getTreeParents({
          data: this.menuList,
          value: row.menuId,
          key: 'menuId'
        });
        parents.forEach((menu) => {
          this.form.parentId.push(menu.menuId);
        });
      }
      this.open = true;
      this.title = "添加菜单";
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getMenu(row.menuId).then(res => {
        if (res.code === 200) {
          this.form = res.data;
          this.open = true;
          this.title = "修改菜单";
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.butLoading = true;
          const query = this.$LJSbase.deepCopy(this.form);
          query.parentId = query.parentId[query.parentId.length - 1];
          if (this.form.menuId != undefined) {
            updateMenu(query).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
              this.butLoading = false;
            });
          } else {
            addMenu(query).then(res => {
              if (res.code === 200) {
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
      this.$LJSEl.delMessageBox({
        message: '是否确认删除名称为"' + row.menuName + '"的数据项？',
        doSomething: () => {
          this.$store.commit('loadingStore', {
            tag: true,
            text: '删除中....'
          });
          delMenu(row.menuId).then((res) => {
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
    }
  }
};