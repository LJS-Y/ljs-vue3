<template>
  <div class="childPage">
    <el-form class="comSearch" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable style="width: 240px">
          <el-option
            v-for="dict in sys_normal_disable"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
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
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            @click="handleAdd"
            v-hasPermi="['system:menu:add']"
          ><el-icon class="el-icon--left"><Plus /></el-icon>新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            plain
            @click="toggleExpandAll"
          ><el-icon class="el-icon--left"><Sort /></el-icon>展开/折叠</el-button>
        </el-col>
      </el-row>

      <el-table
        class="comTable"
        v-if="refreshTable"
        v-loading="loading"
        :data="menuList"
        row-key="menuId"
        :default-expand-all="isExpandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template #default="scope">
            <svg-icon v-if="scope.row.icon !== null" :iconName="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="60" align="center"></el-table-column>
        <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="165" align="center" prop="createTime">
          <template #default="scope">
            <span>{{ $LJSdate.formatTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template #default="scope">
            <el-button 
              type="primary"
              size="small"
              text
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:menu:edit']"
            ><el-icon><EditPen /></el-icon>修改</el-button>
            <el-button
              type="primary"
              size="small"
              text
              @click="handleAdd(scope.row)"
              v-hasPermi="['system:menu:add']"
            ><el-icon><Plus /></el-icon>新增</el-button>
            <el-button
              type="primary"
              size="small"
              text
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:menu:remove']"
            ><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="open" width="70%" top="5vh" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <el-cascader
                v-model="form.parentId"
                :options="menuOptions"
                :props="{ value: 'menuId', label: 'menuName', checkStrictly: true }"
                :show-all-levels="false"
                placeholder="选择上级菜单"
                style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio value="M">目录</el-radio>
                <el-radio value="C">菜单</el-radio>
                <el-radio value="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover placement="bottom-start" width="calc(100% + 100px)" :teleported="false" popper-style="left: -100px" trigger="click">
                <template #reference>
                  <el-input v-model="form.icon" placeholder="点击选择图标" readonly>
                    <svg-icon
                      v-if="form.icon"
                      :icon-class="form.icon"
                      class="el-input__icon"
                      style="height: 32px;width: 16px;"
                    />
                    <i v-else class="el-icon-search el-input__icon" />
                  </el-input>
                </template>
                <IconSelect ref="iconSelect" @selected="selected" />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="isFrame">
              <template #label>
                <el-popover
                  placement="top"
                  :width="200"
                  effect="dark"
                  trigger="click"
                  content="选择是外链则路由地址需要以`http(s)://`开头"
                >
                  <template #reference>
                    <el-icon class="formItemIcon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
                是否外链
              </template>
              <template #default>
                <el-radio-group v-model="form.isFrame">
                  <el-radio value="0">是</el-radio>
                  <el-radio value="1">否</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <template #label>
                <el-popover
                  placement="top"
                  :width="200"
                  effect="dark"
                  trigger="click"
                  content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                >
                  <template #reference>
                    <el-icon class="formItemIcon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
                路由地址
              </template>
              <template #default>
                <el-input v-model="form.path" placeholder="请输入路由地址" />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="component">
              <template #label>
                <el-popover
                  placement="top"
                  :width="200"
                  effect="dark"
                  trigger="click"
                  content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                >
                  <template #reference>
                    <el-icon class="formItemIcon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
                组件路径
              </template>
              <template #default>
                <el-input v-model="form.component" placeholder="请输入组件路径" />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item prop="perms">
              <template #label>
                <el-popover
                  placement="top"
                  :width="200"
                  effect="dark"
                  trigger="click"
                  content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                >
                  <template #reference>
                    <el-icon class="formItemIcon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
                权限字符
              </template>
              <template #default>
                <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="query">
              <template #label>
                <el-popover
                  placement="top"
                  :width="200"
                  effect="dark"
                  trigger="click"
                  content="访问路由的默认传递参数，如：`{'id': 1, 'name': 'ry'}`"
                >
                  <template #reference>
                    <el-icon class="formItemIcon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
                路由参数
              </template>
              <template #default>
                <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="isCache">
              <template #label>
                <el-popover
                  placement="top"
                  :width="200"
                  effect="dark"
                  trigger="click"
                  content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                >
                  <template #reference>
                    <el-icon class="formItemIcon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
                是否缓存
              </template>
              <template #default>
                <el-radio-group v-model="form.isCache">
                  <el-radio value="0">缓存</el-radio>
                  <el-radio value="1">不缓存</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="visible">
              <template #label>
                <el-popover
                  placement="top"
                  :width="200"
                  effect="dark"
                  trigger="click"
                  content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                >
                  <template #reference>
                    <el-icon class="formItemIcon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
                显示状态
              </template>
              <template #default>
                <el-radio-group v-model="form.visible">
                  <el-radio
                    v-for="dict in sys_show_hide"
                    :key="dict.dictValue"
                    :value="dict.dictValue"
                  >{{dict.dictLabel}}</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="status">
              <template #label>
                <el-popover
                  placement="top"
                  :width="200"
                  effect="dark"
                  trigger="click"
                  content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                >
                  <template #reference>
                    <el-icon class="formItemIcon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
                菜单状态
              </template>
              <template #default>
                <el-radio-group v-model="form.status">
                  <el-radio
                    v-for="dict in sys_normal_disable"
                    :key="dict.dictValue"
                    :value="dict.dictValue"
                  >{{dict.dictLabel}}</el-radio>
                </el-radio-group>
              </template>
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
  </div>
</template>

<script>
import index from "./index.js";
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
