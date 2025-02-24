<template>
  <div class="childPage">

    <div class="comPage">
      <el-form class="comSearch" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
        <el-form-item label="系统模块" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入系统模块"
            clearable
            style="width: 240px;"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="操作人员" prop="operName">
          <el-input
            v-model="queryParams.operName"
            placeholder="请输入操作人员"
            clearable
            style="width: 240px;"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="类型" prop="businessType">
          <el-select
            v-model="queryParams.businessType"
            placeholder="操作类型"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="dict in sys_oper_type"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="操作状态"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="dict in sys_common_status"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <DateRange
          formItemLabel="操作时间"
          v-model="dateRange"
          dateType="date"
          :disabledDate_start="$LJSfc.pickerOptions()"
          :disabledDate_end="$LJSfc.pickerOptions()">
        </DateRange>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <el-icon class="el-icon--left"><Search /></el-icon>搜索
          </el-button>
          <el-button type="warning" @click="resetQuery">
            <el-icon class="el-icon--left"><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="comOperate">
        <el-col :span="1.5" v-hasPermi="['monitor:operlog:remove']">
          <el-button
            type="danger"
            :disabled="multiple"
            @click="handleDelete"
          ><el-icon class="el-icon--left"><Delete /></el-icon>删除</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['monitor:operlog:remove']">
          <el-button
            type="danger"
            @click="handleClean"
          >清空</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['monitor:operlog:export']">
          <el-button
            type="warning"
            size="default"
            @click="handleExport"
          ><el-icon class="el-icon--left"><Upload /></el-icon>导出</el-button>
        </el-col>
      </el-row>

      <el-table class="comTable" ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="日志编号" align="center" prop="operId" />
        <el-table-column label="系统模块" align="center" prop="title" />
        <el-table-column label="操作类型" align="center" prop="businessType">
          <template #default="scope">
            <dict-tag :options="sys_oper_type" :value="scope.row.businessType"/>
          </template>
        </el-table-column>
        <el-table-column label="请求方式" align="center" prop="requestMethod" />
        <el-table-column label="操作人员" align="center" prop="operName" width="100" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" />
        <el-table-column label="操作地址" align="center" prop="operIp" width="130" :show-overflow-tooltip="true" />
        <el-table-column label="操作地点" align="center" prop="operLocation" :show-overflow-tooltip="true" />
        <el-table-column label="操作状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_common_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作日期" align="center" prop="operTime" sortable="custom" :sort-orders="['descending', 'ascending']" width="180">
          <template #default="scope">
            <span>{{ $LJSdate.formatTime(scope.row.operTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              text
              @click="handleView(scope.row,scope.index)"
              v-hasPermi="['monitor:operlog:query']"
            >详细</el-button>
          </template>
        </el-table-column>
      </el-table>
        
      <DPPagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" v-model="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
            <el-form-item
              label="登录信息："
            >{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ $LJSdate.formatTime(form.operTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="open = false">关 闭</el-button>
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

