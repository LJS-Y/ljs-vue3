<template>
  <div class="childPage">
    <el-form class="comSearch" :model="tableSearch.query" ref="queryForm" :inline="true">
      <el-form-item label="岗位编码" prop="postCode">
        <el-input
          v-model="tableSearch.query.postCode"
          placeholder="请输入岗位编码"
          clearable
          @keyup.enter="handleQuery"
          style="width: 150px;"
        />
      </el-form-item>
      <el-form-item label="岗位名称" prop="postName">
        <el-input
          v-model="tableSearch.query.postName"
          placeholder="请输入岗位名称"
          clearable
          @keyup.enter="handleQuery"
          style="width: 150px;"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="tableSearch.query.status" placeholder="岗位状态" clearable style="width: 200px">
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
        <el-col :span="1.5" v-hasPermi="['system:post:add']">
          <el-button
            type="primary"
            plain
            @click="handleAdd"
          ><el-icon class="el-icon--left"><Plus /></el-icon>新增</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['system:post:remove']">
          <el-button
            type="danger"
            plain
            :disabled="operate.multiple"
            @click="handleDelete"
          ><el-icon class="el-icon--left"><Delete /></el-icon>删除</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['system:post:export']">
          <el-button
            type="warning"
            plain
            @click="handleExport"
          ><el-icon class="el-icon--left"><Download /></el-icon>导出</el-button>
        </el-col>
      </el-row>

      <el-table class="comTable" v-loading="table.loading" :data="table.data" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="岗位名称" align="center" prop="postName" show-overflow-tooltip />
        <el-table-column label="岗位编码" align="center" prop="postCode" show-overflow-tooltip />
        <el-table-column label="岗位排序" align="center" prop="postSort" />
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
        <el-table-column label="操作" align="center" width="230">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              text
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:post:edit']"
            ><el-icon><EditPen /></el-icon>修改</el-button>
            <el-button
              type="primary"
              size="small"
              text
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:post:remove']"
            ><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="table.total > 0"
        :total="table.total"
        v-model:page="tableSearch.queryReal.pageNum"
        v-model:limit="tableSearch.queryReal.pageSize"
        @pagination="getList"
      />
    </div>
    

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="tc.title" v-model="tc.open" width="500px" append-to-body>
      <el-form ref="form" :model="form.data" :rules="form.rules" label-width="80px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.data.postName" maxlength="50" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="form.data.postCode" maxlength="64" placeholder="请输入编码名称" />
        </el-form-item>
        <el-form-item label="岗位顺序" prop="postSort">
          <el-input v-model="form.data.postSort" @input="$LJSfc.numCheck({form: form.data, key: 'postSort'})" maxlength="9" placeholder="请输入岗位顺序" />
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="form.data.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.dictValue"
              :value="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.data.remark" type="textarea" maxlength="250" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <ButtonThrottle v-model="form.butLoading" style="margin-right: 12px;">
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
