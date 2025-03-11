<template>
  <div class="childPage">
    <el-form class="comSearch" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入权限字符"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <DateRange
        formItemLabel="创建时间"
        v-model="dateRange"
        dateType="date"
        :disabledDate_start="$LJSfc.pickerOptions()"
        :disabledDate_end="$LJSfc.pickerOptions()">
      </DateRange>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">
          <el-icon class="el-icon--left"><Search /></el-icon>搜索
        </el-button>
        <el-button @click="resetQuery">
          <el-icon class="el-icon--left"><Refresh /></el-icon>重置
        </el-button>
      </el-form-item>
    </el-form>

    <div class="comPage">
      <el-row :gutter="10" class="comOperate">
        <el-col :span="1.5" v-hasPermi="['system:role:add']">
          <el-button
            type="primary"
            plain
            @click="handleAdd"
          ><el-icon class="el-icon--left"><Plus /></el-icon>新增</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['system:role:remove']">
          <el-button
            type="danger"
            plain
            :disabled="multiple"
            @click="handleDelete"
          ><el-icon class="el-icon--left"><Delete /></el-icon>删除</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['system:role:export']">
          <el-button
            type="warning"
            plain
            @click="handleExport"
          ><el-icon class="el-icon--left"><Download /></el-icon>导出</el-button>
        </el-col>
      </el-row>

      <el-table class="comTable" v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色编号" prop="roleId" />
        <el-table-column label="角色名称" prop="roleName" show-overflow-tooltip />
        <el-table-column label="权限字符" prop="roleKey" show-overflow-tooltip />
        <el-table-column label="显示顺序" prop="roleSort" width="100" />
        <el-table-column label="状态" align="center" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ $LJSdate.formatTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230">
          <template #default="scope">
            <template v-if="scope.row.roleId !== 1">
              <el-button
                type="primary"
                size="small"
                text
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:role:edit']"
              ><el-icon><EditPen /></el-icon>修改</el-button>
              <el-button
                type="primary"
                size="small"
                text
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:role:remove']"
              ><el-icon><Delete /></el-icon>删除</el-button>
              <el-dropdown @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:role:edit']">
                <el-button
                  type="primary"
                  size="small"
                  text
                  ><el-icon><DArrowRight /></el-icon>更多</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="handleDataScope"><el-icon><Check /></el-icon>数据权限</el-dropdown-item>
                    <el-dropdown-item command="handleAuthUser"><el-icon><User /></el-icon>分配用户</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </template>
        </el-table-column>
      </el-table>
      
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" maxlength="30" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <template #label>
            <el-popover
              placement="top"
              :width="200"
              effect="dark"
              trigger="click"
              content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
            >
              <template #reference>
                <el-icon class="formItemIcon"><QuestionFilled /></el-icon>
              </template>
            </el-popover>
            权限字符
          </template>
          <template #default>
            <el-input v-model="form.roleKey" maxlength="100" placeholder="请输入权限字符" />
          </template>
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input v-model="form.roleSort" @input="$LJSfc.numCheck({form, key: 'roleSort'})" maxlength="10" placeholder="请输入角色顺序" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.dictValue"
              :value="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" maxlength="250" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <ButtonThrottle v-model="butLoading" style="margin-right: 12px;">
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </ButtonThrottle>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title"  v-model="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange" style="width: 100%;">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <ButtonThrottle v-model="dataScope_butLoading" style="margin-right: 12px;">
          <el-button type="primary" @click="submitDataScope">确 定</el-button>
        </ButtonThrottle>
        <el-button @click="cancelDataScope">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 分配用户操作对话框 -->
    <el-dialog class="comTc" :title="title" v-model="openAllocationUser" width="80%" append-to-body>
      <el-form :model="allocationUser.queryParams" ref="queryForm" :inline="true" v-show="showSearch">
        <el-form-item label="用户名称" prop="userName">
          <el-input
            v-model="allocationUser.queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input
            v-model="allocationUser.queryParams.phonenumber"
            placeholder="请输入手机号码"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="allocationUser_handleQuery">
            <el-icon class="el-icon--left"><Search /></el-icon>搜索
          </el-button>
          <el-button @click="allocationUser_resetQuery">
            <el-icon class="el-icon--left"><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="comOperate" style="margin-bottom: 12px;">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            @click="allocationUser_openSelectUser"
            v-hasPermi="['system:role:add']"
          >添加用户</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            :disabled="allocationUser.multiple"
            @click="allocationUser_cancelAuthUserAll"
            v-hasPermi="['system:role:remove']"
          >批量取消授权</el-button>
        </el-col>
      </el-row>

      <el-table class="comTable" v-loading="allocationUser.loading" :data="allocationUser.userList" @selection-change="allocationUser_handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户名称" prop="userName" show-overflow-tooltip />
        <el-table-column label="用户昵称" prop="nickName" show-overflow-tooltip />
        <el-table-column label="邮箱" prop="email" show-overflow-tooltip />
        <el-table-column label="手机" prop="phonenumber" show-overflow-tooltip />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ $LJSdate.formatTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              text
              @click="allocationUser_cancelAuthUser(scope.row)"
              v-hasPermi="['system:role:remove']"
            >取消授权</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="allocationUser.total>0"
        :total="allocationUser.total"
        v-model:page="allocationUser.queryParams.pageNum"
        v-model:limit="allocationUser.queryParams.pageSize"
        @pagination="allocationUser_getList"
      />
      <select-user ref="select" :roleId="allocationUser.queryParams.roleId" @ok="allocationUser_handleQuery" />
    </el-dialog>
  </div>
</template>

<script>
import index from "./index.js";
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>