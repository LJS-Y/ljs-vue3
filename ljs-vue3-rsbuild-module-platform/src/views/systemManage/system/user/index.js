import { reactive } from 'vue';
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus, deptTreeSelect, optionselect } from "@/api/systemManage/system/user";
import { getConfigKey } from "@/api/systemManage/system/config";
import { listNo } from "@/api/systemManage/system/module";

export default {
  name: "User",
  data() {
    return {
      h: 0,
      // 字典
      sys_normal_disable: [],
      sys_user_sex: [],
      // 基础数据
      baseData: {
        // 模块
        module: [],
        dept: undefined,
        optionselect: [],
      },
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 组织机构树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 组织机构名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + this.$store.getters.token },
        // 上传的地址
        url: import.meta.env.PUBLIC_API_URL + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      // 节流阀
      butLoading: false,
    };
  },
  watch: {
    // 根据名称筛选组织机构树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    getConfigKey("sys.user.initPassword").then(res => {
      if (res.code === 200) {
        this.initPassword = res.msg;
      }
    });
    this.initData();
  },
  methods: {
    // 节点单击事件
    // handleNodeClick(data) {
    //   this.queryParams.deptId = data.id;
    //   this.handleQuery();
    // },
    nodeClick(node) {
      let keys = this.$refs.tree.getCheckedKeys();
      if (keys.length >= 2) {
        this.$refs.tree.setCheckedKeys([node.id], false);
      }
      keys = this.$refs.tree.getCheckedKeys();
      if (keys.length === 0) {
        this.baseData.dept = undefined;
      } else {
        this.baseData.dept = node;
      }
      
      this.handleQuery();
    },
    // 初始化数据
    async initData() {
      this.h = document.documentElement.clientHeight - 108;
      const res1 = await this.$dict.getDict('sys_normal_disable');
      if (res1) {
        this.sys_normal_disable = res1;
      }
      const res2 = await this.$dict.getDict('sys_user_sex');
      if (res2) {
        this.sys_user_sex = res2;
      }
      // await this.getOptionselect();
      this.getList();
      this.getDeptTree();
    },
    async getOptionselect() {
      const res = await optionselect();
      if (res.code === 200) {
        this.baseData.optionselect = res.data;
      }
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      const query = this.$LJSbase.deepCopy(this.queryParams);
      if (this.baseData.dept) {
        query.deptId = this.baseData.dept.id;
      }
      listUser(this.addDateRange(query, this.dateRange)).then(res => {
        if (res.code === 200) {
          this.userList = res.rows;
          this.total = res.total;
        }
        this.loading = false;
      });
    },
    /** 查询组织机构下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(res => {
        if (res.code === 200) {
          this.deptOptions = res.data;
        }
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗？').then(function() {
        return changeUserStatus(row.userId, row.status);
      }).then((res) => {
        if (res.code === 200) {
          this.$modal.msgSuccess(text + "成功");
        }
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
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
        userId: undefined,
        deptId: this.baseData.dept !== undefined ? this.baseData.dept.id : undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    async getModule() {
      const res = await listNo();
      if (res.code === 200) {
        this.baseData.module = res.data;
      }
    },
    /** 新增按钮操作 */
    async handleAdd() {
      this.reset();
      // 获取模块
      await this.getModule();
      // 获取岗位、角色
      const res = await getUser();
      if (res.code === 200) {
        this.postOptions = res.posts;
        this.roleOptions = this.roleDataChange(this.baseData.module, res.roles);
        this.open = true;
        this.title = "添加用户";
        this.form.password = this.initPassword;
      }
    },
    // 组装一个模块与角色的树形数据
    roleDataChange(module, roles) {
      let selfStr = 'module';
      let selfIndex = 0;
      module.forEach((item) => {
        item.treeName = item.moduleName;
        item.disabled = true;
        item.selfId = selfStr + selfIndex;
        selfIndex++;
        item.children = [];
      });

      selfStr = 'role-';
      roles.forEach((role) => {
        const nums = module.length;
        for (let i = 0; i < nums; i++) {
          const item = module[i];
          if (role.moduleId === item.id) {
            role.treeName = role.roleName;
            role.selfId = selfStr + role.roleId;
            selfIndex++;
            item.children.push(role);
            break;
          }
        }
      });
      return module;
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      // 获取模块
      await this.getModule();
      // 获取岗位、角色
      const res = await getUser(row.userId);
      if (res.code === 200) {
        this.form = res.data;
        this.postOptions = res.posts;
        this.roleOptions = this.roleDataChange(this.baseData.module, res.roles);
        const roleIds = [];
        const selfStr = 'role-';
        res.roleIds.forEach((roleId) => {
          roleIds.push(selfStr + roleId);
        });
        this.form.postIds = reactive(res.postIds);
        this.form.roleIds = roleIds;
        // this.$set(this.form, "postIds", res.postIds);
        // this.$set(this.form, "roleIds", res.roleIds);
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      }
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用户密码长度必须介于 5 和 20 之间"
      }).then(({ value }) => {
        resetUserPwd(row.userId, value).then(res => {
          if (res.code === 200) {
            this.$modal.msgSuccess("修改成功，新密码是：" + value);
          }
        });
      }).catch(() => {});
    },
    /** 分配角色操作 */
    handleAuthRole: function(row) {
      const userId = row.userId;
      this.title = '分配用户';
      this.openAllocationUser = true;
      this.allocationUser.queryParams.roleId = roleId;
      this.allocationUser_getList();
      // this.$router.push("/system/user-auth/role/" + userId);
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.butLoading = true;
          const query = this.$LJSbase.deepCopy(this.form);
          const depIdArray = typeof query.deptId === 'object' && query.deptId !== null && Array.isArray(query.deptId);
          if (depIdArray && query.deptId !== undefined && query.deptId !== null && query.deptId.length !== 0) {
            query.deptId = query.deptId[query.deptId.length - 1];
          }
          if (query.roleIds.length > 0) {
            const roleIds = [];
            query.roleIds.forEach((roleId) => {
              roleIds.push(Number(roleId.split('-')[1]));
            });
            query.roleIds = roleIds;
          }
          if (this.form.userId != undefined) {
            updateUser(query).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
              this.butLoading = false;
            });
          } else {
            addUser(query).then(res => {
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
      const userIds = row.userId || this.ids;
      this.$LJSEl.delMessageBox({
        message: '是否确认删除用户编号为"' + userIds + '"的数据项？',
        doSomething: () => {
          this.$store.commit('loadingStore', {
            tag: true,
            text: '删除中....'
          });
          delUser(userIds).then((res) => {
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
      this.download('/system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/system/user/importTemplate', {
      }, `user_template_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(res, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + res.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};