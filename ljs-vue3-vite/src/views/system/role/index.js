import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus, deptTreeSelect, allocatedUserList, authUserCancel, authUserCancelAll } from '@/api/system/role.js';
import { treeselect as menuTreeselect, roleMenuTreeselect } from '@/api/system/menu.js';
import selectUser from './selectUser.vue';

export default {
  name: 'Role',
  components: { selectUser },
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
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      // 是否显示弹出层（分配用户）
      openAllocationUser: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定数据权限'
        },
        {
          value: '3',
          label: '本部门数据权限'
        },
        {
          value: '4',
          label: '本部门及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        }
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ]
      },
      // 分配用户
      allocationUser: {
        // 遮罩层
        loading: false,
        // 选中用户组
        userIds: [],
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 用户表格数据
        userList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          roleId: undefined,
          userName: undefined,
          phonenumber: undefined
        }
      },
      // 节流阀
      butLoading: false,
      // 节流阀
      dataScope_butLoading: false,
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
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        if (res.code === 200) {
          this.roleList = res.rows;
          this.total = res.total;
        }
        this.loading = false;
      });
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(res => {
        if (res.code === 200) {
          this.menuOptions = res.data;
        }
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(res => {
        if (res.code === 200) {
          this.menuOptions = res.menus;
          return res;
        }
      });
    },
    /** 根据角色ID查询部门树结构 */
    getDeptTree(roleId) {
      return deptTreeSelect(roleId).then(res => {
        if (res.code === 200) {
          this.deptOptions = res.depts;
          return res;
        }
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用';
      this.$modal.confirm(`确认要“${text}”“${row.roleName}”色吗？`).then(function() {
        return changeRoleStatus(row.roleId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + '成功');
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0';
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false,
      this.menuNodeAll = false,
      this.deptExpand = true,
      this.deptNodeAll = false,
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: '0',
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'handleDataScope':
          this.handleDataScope(row);
          break;
        case 'handleAuthUser':
          this.handleAuthUser(row);
          break;
        default:
          break;
      }
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions: []);
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true: false;
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true: false;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getMenuTreeselect();
      this.open = true;
      this.title = '添加角色';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const roleId = row.roleId || this.ids
      const roleMenu = this.getRoleMenuTreeselect(roleId);
      getRole(roleId).then(res => {
        if (res.code === 200) {
          res.data.roleSort = Number(res.data.roleSort); // 接口返回数据格式不符合组件需求
          this.form = res.data;
          this.open = true;
          this.$nextTick(() => {
            roleMenu.then(res1 => {
              if (res1.code === 200) {
                let checkedKeys = res1.checkedKeys
                checkedKeys.forEach((v) => {
                  this.$nextTick(()=>{
                    this.$refs.menu.setChecked(v, true ,false);
                  })
                })
              }
            });
          });
        }
        this.title = '修改角色';
      });
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if(value !== '2') {
        this.$refs.dept.setCheckedKeys([]);
      }
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset();
      const deptTreeSelect = this.getDeptTree(row.roleId);
      getRole(row.roleId).then(res => {
        if (res.code === 200) {
          this.form = res.data;
          this.openDataScope = true;
          this.$nextTick(() => {
            deptTreeSelect.then(res1 => {
              if (res1.code === 200) {
                this.$refs.dept.setCheckedKeys(res1.checkedKeys);
              }
            });
          });
          this.title = '分配数据权限';
        }
      });
    },
    /** 分配用户操作 */
    handleAuthUser: function(row) {
      const roleId = row.roleId;
      this.title = '分配用户';
      this.openAllocationUser = true;
      this.allocationUser.queryParams.roleId = roleId;
      this.allocationUser_getList();
      // this.$router.push('/system/authUser?roleId=' + roleId);
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.butLoading = true;
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              }
              this.butLoading = false;
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            addRole(this.form).then(res => {
              if (res.code === 200) {
                this.$modal.msgSuccess('新增成功');
                this.open = false;
                this.getList();
              }
              this.butLoading = false;
            });
          }
        }
      });
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      this.dataScope_butLoading = true;
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys();
        dataScope(this.form).then(res => {
          if (res.code === 200) {
            this.$modal.msgSuccess('修改成功');
            this.openDataScope = false;
            this.getList();
          }
          this.dataScope_butLoading = false;
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids;
      this.$LJSEl.delMessageBox({
        message: `是否确认删除角色编号为“${roleIds}”的数据项？`,
        doSomething: () => {
          this.$store.commit('loadingStore', {
            tag: true,
            text: '删除中....'
          });
          delRole(roleIds).then((res) => {
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
      this.download('system/role/export', {
        ...this.queryParams
      }, `role_${new Date().getTime()}.xlsx`)
    },

    // 分配用户操作
    /** 查询授权用户列表 */
    allocationUser_getList() {
      this.allocationUser.loading = true;
      allocatedUserList(this.allocationUser.queryParams).then(res => {
        if (res.code === 200) {
          this.allocationUser.userList = res.rows;
          this.allocationUser.total = res.total;
        }
        this.allocationUser.loading = false;
      });
    },
    /** 搜索按钮操作 */
    allocationUser_handleQuery() {
      this.allocationUser.queryParams.pageNum = 1;
      this.allocationUser_getList();
    },
    /** 重置按钮操作 */
    allocationUser_resetQuery() {
      this.resetForm('queryForm');
      this.allocationUser_handleQuery();
    },
    // 多选框选中数据
    allocationUser_handleSelectionChange(selection) {
      this.allocationUser.userIds = selection.map(item => item.userId);
      this.allocationUser.multiple = !selection.length
    },
    /** 打开授权用户表弹窗 */
    allocationUser_openSelectUser() {
      this.$refs.select.show();
    },
    /** 取消授权按钮操作 */
    allocationUser_cancelAuthUser(row) {
      const roleId = this.allocationUser.queryParams.roleId;
      this.$modal.confirm(`确认要取消该用户“${row.userName}”角色吗？`).then(function() {
        return authUserCancel({ userId: row.userId, roleId: roleId });
      }).then(() => {
        this.allocationUser_getList();
        this.$modal.msgSuccess('取消授权成功');
      }).catch(() => {});
    },
    /** 批量取消授权按钮操作 */
    allocationUser_cancelAuthUserAll(row) {
      const roleId = this.allocationUser.queryParams.roleId;
      const userIds = this.allocationUser.userIds.join(',');
      this.$modal.confirm('是否取消选中用户授权数据项？').then(function() {
        return authUserCancelAll({ roleId: roleId, userIds: userIds });
      }).then(() => {
        this.allocationUser_getList();
        this.$modal.msgSuccess('取消授权成功');
      }).catch(() => {});
    }
  }
};