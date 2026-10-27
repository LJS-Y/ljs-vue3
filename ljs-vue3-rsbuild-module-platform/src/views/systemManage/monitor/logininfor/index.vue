<template>
  <div class="childPage">

    <div class="comPage">
      <el-form class="comSearch" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
        <el-form-item label="登录地址" prop="ipaddr">
          <el-input
            v-model="queryParams.ipaddr"
            placeholder="请输入登录地址"
            clearable
            style="width: 240px;"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            style="width: 240px;"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="登录状态"
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
          formItemLabel="登录时间"
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
        <el-col :span="1.5" v-hasPermi="['monitor:logininfor:remove']">
          <el-button
            type="danger"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['monitor:logininfor:remove']">
          <el-button
            type="danger"
            @click="handleClean"
          >清空</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['monitor:logininfor:unlock']">
          <el-button
            type="primary"
            :disabled="single"
            @click="handleUnlock"
          >解锁</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['monitor:logininfor:export']">
          <el-button
            type="warning"
            size="default"
            @click="handleExport"
          ><el-icon class="el-icon--left"><Upload /></el-icon>导出</el-button>
        </el-col>
      </el-row>

      <el-table class="comTable" ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="访问编号" align="center" prop="infoId" />
        <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" />
        <el-table-column label="登录地址" align="center" prop="ipaddr" width="130" :show-overflow-tooltip="true" />
        <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
        <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
        <el-table-column label="操作系统" align="center" prop="os" />
        <el-table-column label="登录状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="sys_common_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作信息" align="center" prop="msg" />
        <el-table-column label="登录日期" align="center" prop="loginTime" sortable="custom" :sort-orders="['descending', 'ascending']" width="180">
          <template #default="scope">
            <span>{{ $LJSdate.formatTime(scope.row.loginTime) }}</span>
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
  </div>
</template>

<script>
import index from "./index";
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

