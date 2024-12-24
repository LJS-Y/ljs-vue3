<template>
  <div class="childPage">
    <el-form class="comSearch" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="字典名称" prop="dictName">
        <el-input
          v-model="queryParams.dictName"
          placeholder="请输入字典名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input
          v-model="queryParams.dictType"
          placeholder="请输入字典类型"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="字典状态"
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
        <el-col :span="1.5" v-hasPermi="['system:dict:add']">
          <el-button
            type="primary"
            plain
            @click="handleAdd"
          ><el-icon class="el-icon--left"><Plus /></el-icon>新增</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['system:dict:remove']">
          <el-button
            type="danger"
            plain
            :disabled="multiple"
            @click="handleDelete"
          ><el-icon class="el-icon--left"><Delete /></el-icon>删除</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['system:dict:remove']">
          <el-button
            type="danger"
            plain
            @click="handleRefreshCache"
          ><el-icon class="el-icon--left"><Refresh /></el-icon>刷新缓存</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['system:dict:export']">
          <el-button
            type="warning"
            plain
            @click="handleExport"
          ><el-icon class="el-icon--left"><Download /></el-icon>导出</el-button>
        </el-col>
      </el-row>

      <el-table class="comTable" v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="字典编号" align="center" prop="dictId" />
        <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true" />
        <el-table-column label="字典类型" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <!-- <router-link :to="'/system/dictData?dictId=' + " class="link-type">
            </router-link> -->
            <span @click="$run.push({
              path: '/system/dictData',
              query: {dictId: scope.row.dictId}
            })" style="cursor: pointer; color: #337ab7;">{{ scope.row.dictType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ $LJSdate.formatTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              text
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:dict:edit']"
            ><el-icon><EditPen /></el-icon>修改</el-button>
            <el-button
              type="primary"
              size="small"
              text
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:dict:remove']"
            ><el-icon><Delete /></el-icon>删除</el-button>
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
    

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in sys_normal_disable"
              :key="dict.dictValue"
              :value="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
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