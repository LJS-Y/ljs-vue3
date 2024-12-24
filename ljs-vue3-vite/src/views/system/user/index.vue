<template>
  <div class="childPage" :style="{
    height: `${h}px`,
  }">
    <div class="left">
      <el-scrollbar>
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入组织机构名称"
            clearable
            prefix-icon="el-icon-search"
            style="margin-bottom: 10px"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            style="max-width: 100%"
            :data="deptOptions"
            node-key="id"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            :accordion="true"
            default-expand-all
            check-strictly
            @node-click="nodeClick"
          />
          <!-- <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          /> -->
        </div>
      </el-scrollbar>
    </div>
    <div class="right">
      <div class="comPage">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入手机号码"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
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

        <el-row :gutter="10" class="comOperate">
          <el-col :span="1.5" v-hasPermi="['system:user:add']">
            <el-button
              type="primary"
              plain
              @click="handleAdd"
            ><el-icon class="el-icon--left"><Plus /></el-icon>新增</el-button>
          </el-col>
          <el-col :span="1.5" v-hasPermi="['system:user:remove']">
            <el-button
              type="danger"
              plain
              :disabled="multiple"
              @click="handleDelete"
            ><el-icon class="el-icon--left"><Delete /></el-icon>删除</el-button>
          </el-col>
          <el-col :span="1.5" v-hasPermi="['system:user:import']">
            <el-button
              type="info"
              plain
              @click="handleImport"
            ><el-icon class="el-icon--left"><Upload /></el-icon>导入</el-button>
          </el-col>
          <el-col :span="1.5" v-hasPermi="['system:user:export']">
            <el-button
              type="warning"
              plain
              @click="handleExport"
            ><el-icon class="el-icon--left"><Download /></el-icon>导出</el-button>
          </el-col>
        </el-row>

        <el-table class="comTable" v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
          <el-table-column label="用户名称" align="center" key="userName" prop="userName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
          <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible" :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible" width="120" />
          <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
                :disabled="scope.row.userId === 1"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
            <template #default="scope">
              <span>{{ $LJSdate.formatTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="240" fixed="right">
            <template #default="scope">
              <template v-if="scope.row.userId !== 1">
                <el-button
                  type="primary"
                  size="small"
                  text
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:user:edit']"
                ><el-icon><EditPen /></el-icon>修改</el-button>
                <el-button
                  type="primary"
                  size="small"
                  text
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:user:remove']"
                ><el-icon><Delete /></el-icon>删除</el-button>
                <el-dropdown @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:user:resetPwd', 'system:user:edit']">
                  <el-button
                    type="primary"
                    size="small"
                    text
                    ><el-icon><DArrowRight /></el-icon>更多</el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="handleResetPwd"><el-icon><Key /></el-icon>重置密码</el-dropdown-item>
                      <!-- <el-dropdown-item command="handleAuthRole"><el-icon><CircleCheck /></el-icon>分配角色</el-dropdown-item> -->
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
    </div>
    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <el-cascader
                v-model="form.deptId"
                :options="deptOptions"
                :props="{ value: 'id', label: 'label', checkStrictly: true }"
                :show-all-levels="false"
                placeholder="请选择归属部门"
                style="width: 100%;"/>
              <!-- <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属部门" /> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option
                  v-for="dict in sys_user_sex"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in sys_normal_disable"
                  :key="dict.dictValue"
                  :value="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择岗位">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <ButtonThrottle v-model="butLoading" style="margin-right: 12px;">
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </ButtonThrottle>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center">
          <div class="el-upload__tip">
            <el-checkbox @click.stop v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click.stop="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <template #footer>
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import index from "./index";
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>