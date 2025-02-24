<template>
  <div class="childPage">
    
    <div class="comPage">
      <el-form class="comSearch" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
        <el-form-item label="任务名称" prop="jobName">
          <el-input
            v-model="queryParams.jobName"
            placeholder="请输入任务名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="任务组名" prop="jobGroup">
          <el-select v-model="queryParams.jobGroup" placeholder="请选择任务组名" clearable style="width: 200px;">
            <el-option
              v-for="dict in sys_job_group"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择任务状态" clearable style="width: 200px;">
            <el-option
              v-for="dict in sys_job_status"
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
          <el-button type="warning" @click="resetQuery">
            <el-icon class="el-icon--left"><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="comOperate">
        <el-col :span="1.5" v-hasPermi="['monitor:job:add']">
          <el-button
            type="primary"
            @click="handleAdd"
          ><el-icon class="el-icon--left"><Plus /></el-icon>新增</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['monitor:job:remove']">
          <el-button
            type="danger"
            size="default"
            :disabled="multiple"
            @click="handleDelete"
          ><el-icon class="el-icon--left"><Delete /></el-icon>删除</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['monitor:job:export']">
          <el-button
            type="warning"
            size="default"
            @click="handleExport"
          ><el-icon class="el-icon--left"><Upload /></el-icon>导出</el-button>
        </el-col>
        <el-col :span="1.5" v-hasPermi="['monitor:job:query']">
          <el-button
            type="info"
            size="default"
            @click="handleJobLog"
          ><el-icon class="el-icon--left"><Tickets /></el-icon>日志</el-button>
        </el-col>
      </el-row>

      <el-table class="comTable" v-loading="loading" :data="jobList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="任务编号" width="100" align="center" prop="jobId" />
        <el-table-column label="任务名称" align="center" prop="jobName" :show-overflow-tooltip="true" />
        <el-table-column label="任务组名" align="center" prop="jobGroup">
          <template #default="scope">
            <dict-tag :options="sys_job_group" :value="scope.row.jobGroup"/>
          </template>
        </el-table-column>
        <el-table-column label="调用目标字符串" align="center" prop="invokeTarget" :show-overflow-tooltip="true" />
        <el-table-column label="cron执行表达式" align="center" prop="cronExpression" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              text
              @click="handleUpdate(scope.row)"
              v-hasPermi="['monitor:job:edit']"
            ><el-icon><EditPen /></el-icon>修改</el-button>
            <el-button
              type="danger"
              size="small"
              text
              @click="handleDelete(scope.row)"
              v-hasPermi="['monitor:job:remove']"
            ><el-icon><Delete /></el-icon>删除</el-button>
            <el-dropdown @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['monitor:job:changeStatus', 'monitor:job:query']">
              <el-button
                type="primary"
                size="small"
                text
                ><el-icon><DArrowRight /></el-icon>更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="handleRun"><el-icon><Check /></el-icon>执行一次</el-dropdown-item>
                  <el-dropdown-item command="handleView"><el-icon><User /></el-icon>任务详细</el-dropdown-item>
                  <el-dropdown-item command="handleJobLog"><el-icon><User /></el-icon>调度日志</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="form.jobName" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobGroup">
              <el-select v-model="form.jobGroup" placeholder="请选择任务分组">
                <el-option
                  v-for="dict in sys_job_group"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="invokeTarget">
              <template #label>
                <el-popover
                  placement="top"
                  :width="200"
                  effect="dark"
                  trigger="click"
                  content="Bean调用示例：ryTask.ryParams('ry')；
                    Class类调用示例：com.ruoyi.quartz.task.RyTask.ryParams('ry')；
                    参数说明：支持字符串，布尔类型，长整型，浮点型，整型"
                >
                  <template #reference>
                    <el-icon class="formItemIcon"><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
                调用方法
              </template>
              <template #default>
                <el-input v-model="form.invokeTarget" placeholder="请输入调用目标字符串" />
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="请输入cron执行表达式">
                <template #append>
                  <el-button type="primary" @click="handleShowCron">
                    生成表达式
                    <i class="el-icon-time el-icon--right"></i>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行策略" prop="misfirePolicy">
              <el-radio-group v-model="form.misfirePolicy" size="small">
                <el-radio-button value="1">立即执行</el-radio-button>
                <el-radio-button value="2">执行一次</el-radio-button>
                <el-radio-button value="3">放弃执行</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发" prop="concurrent">
              <el-radio-group v-model="form.concurrent" size="small">
                <el-radio-button value="0">允许</el-radio-button>
                <el-radio-button value="1">禁止</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in sys_job_status"
                  :key="dict.dictValue"
                  :value="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>

    <el-dialog title="Cron表达式生成器" v-model="openCron" append-to-body destroy-on-close class="scrollbar">
      <crontab @hide="openCron=false" @fill="crontabFill" :expression="expression"></crontab>
    </el-dialog>

    <!-- 任务日志详细 -->
    <el-dialog title="任务详细" v-model="openView" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务编号：">{{ form.jobId }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ jobGroupFormat(form) }}</el-form-item>
            <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cron表达式：">{{ form.cronExpression }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次执行时间：">{{ this.$LJSdate.formatTime(form.nextValidTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用目标方法：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发：">
              <div v-if="form.concurrent == 0">允许</div>
              <div v-else-if="form.concurrent == 1">禁止</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行策略：">
              <div v-if="form.misfirePolicy == 0">默认策略</div>
              <div v-else-if="form.misfirePolicy == 1">立即执行</div>
              <div v-else-if="form.misfirePolicy == 2">执行一次</div>
              <div v-else-if="form.misfirePolicy == 3">放弃执行</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="openView = false">关 闭</el-button>
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
