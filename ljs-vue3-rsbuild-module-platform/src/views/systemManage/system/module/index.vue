<template>
  <div class="childPage">
    <div class="comPage">
      <el-form class="comSearch" :model="tableSearch.query" size="default" :inline="true">
        <el-form-item label="关键字" prop="keyWords">
          <el-input v-model="tableSearch.query.keyWords" placeholder="模块名称或编码" clearable style="width: 192px;"/>
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
        <el-col :span="1.5" v-hasPermi="['system:module:add']">
          <el-button
            type="primary"
            size="default"
            @click="handleAdd"
          ><el-icon class="el-icon--left"><Plus /></el-icon>新增</el-button>
        </el-col>
      </el-row>

      <el-table
        class="comTable"
        v-loading="table.loading"
        :data="table.data"
        >
        <el-table-column label="模块名称" prop="moduleName" align="center" show-overflow-tooltip/>
        <el-table-column label="模块编码" prop="moduleCode" align="center" show-overflow-tooltip/>
        <el-table-column label="排序" prop="sort" align="center" show-overflow-tooltip/>
        <el-table-column label="状态" prop="status" align="center">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip/>
        <el-table-column label="操作" align="center" width="130" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              text
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:module:edit']"
            ><el-icon><EditPen /></el-icon>修改</el-button>
            <el-button
              size="small"
              type="danger"
              text
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:module:remove']"
              v-if="scope.row.id !== 1"
            ><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <DPPagination
        v-if="table.total > 0"
        :total="table.total"
        v-model:page="tableSearch.queryReal.pageNum"
        v-model:limit="tableSearch.queryReal.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="tc.title" v-model="tc.open" append-to-body width="500px" top="5vh">
      <el-form class="comForm" ref="form" :model="form.data" :rules="form.rules" label-width="110px">
        <el-form-item label="模块名称" prop="moduleName">
          <el-input v-model="form.data.moduleName" maxlength="50" placeholder="请输入模块名称"></el-input>
        </el-form-item>
        <el-form-item label="模块编码" prop="moduleCode">
          <el-input v-model="form.data.moduleCode" maxlength="50" placeholder="请输入模块编码"></el-input>
        </el-form-item>
        <el-form-item label="模式" prop="enable">
          <el-radio-group v-model="form.data.enable" @change="enableChange" :disabled="form.data.id === 1">
            <el-radio-button value="0">内部路径</el-radio-button>
            <el-radio-button value="1">外部链接</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内部路径" prop="url" v-if="form.data.enable === '0'">
          <el-input v-model="form.data.url" maxlength="250" :disabled="form.data.id === 1" placeholder="请输入内部路径"></el-input>
        </el-form-item>
        <el-form-item label="模块类型" prop="moduleType" v-if="form.data.enable === '0'">
          <el-radio-group v-model="form.data.moduleType" :disabled="form.data.id === 1">
            <el-radio-button
              v-for="dict in module_type" :key="dict.dictValue"
              :value="dict.dictValue">{{ dict.dictLabel }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="外部链接" prop="webUrl" v-if="form.data.enable === '1'">
          <el-input v-model="form.data.webUrl" maxlength="250" placeholder="请输入外部链接"></el-input>
        </el-form-item>
        <el-form-item label="模块打开方式" prop="openType">
          <el-radio-group v-model="form.data.openType" :disabled="form.data.id === 1">
            <el-radio-button
              v-for="dict in sys_open_type" :key="dict.dictValue"
              :value="dict.dictValue">{{ dict.dictLabel }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模块图标" prop="icon">
          <el-popover placement="bottom-start" :width="500" trigger="click">
            <template #reference>
              <el-input v-model="form.data.icon" placeholder="点击选择图标" readonly>
                <svg-icon
                  v-if="form.data.icon"
                  :icon-class="form.data.icon"
                  class="el-input__icon"
                  style="height: 32px; width: 16px;"
                />
                <i v-else class="el-icon-search el-input__icon" />
              </el-input>
            </template>
            <IconSelect ref="iconSelect" @selected="selected" />
          </el-popover>
        </el-form-item>
        <el-form-item label="引导图片" prop="imgUrl">
          <image-upload
            :limit="1"
            v-model="form.data.imgUrl"
          />
        </el-form-item>
        <el-form-item label="顺序" prop="sort">
          <el-input
            v-model="form.data.sort"
            @input="$LJSfc.numCheck(form.data, 'sort')"
            maxlength="5"
            placeholder="请输入顺序"
          ></el-input>
        </el-form-item>
        <el-form-item label="模块状态" prop="status">
          <el-radio-group v-model="form.data.status" :disabled="form.data.id === 1">
            <el-radio-button
              v-for="dict in sys_normal_disable"
              :key="dict.dictValue"
              :value="dict.dictValue">{{ dict.dictLabel }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="email">
          <el-input v-model="form.data.remark" :rows="3" type="textarea" maxlength="200" placeholder="请输入描述"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel" class="comResetBut" type="success">取消</el-button>
        <ButtonThrottle v-model="form.butLoading" style="margin-left: 12px;">
          <el-button @click="submitForm" type="primary">保存</el-button>
        </ButtonThrottle>
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