
<!-- <el-col :span="1.5" v-hasPermi="['ywpt:ywptInputData:import']">
  <el-button
    type="info"
    @click="upload.open = true"
  ><el-icon class="el-icon--left"><Download /></el-icon>导入</el-button>
</el-col>
<ExcelImport
  v-model="upload.open"
  title="数据导入"
  :downloadUrl="upload.downloadUrl"
  downloadText="数据导入模板"
  :url="upload.url"
  :doSomething="getList">
</ExcelImport>
js:
export default {
  data() {
    return {
      // 导入参数
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 下载模板的地址
        downloadUrl: '/ywpt/ywptInputData/importTemplate',
        // 上传的地址
        url: import.meta.env.PUBLIC_API_URL + '/ywpt/ywptInputData/importData',
      },
    };
  },
  methods: {
    /** 导入按钮操作 */
    handleImport() {
      this.upload.open = true;
    },
  }
};
-->
<template>
  <!-- 导入 -->
  <el-dialog :title="title" v-model="upload.show" append-to-body width="500px" @close="cancel">
    <div style="padding: 20px 100px 0 100px;">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="url + '?updateSupport=' + upload.updateSupport"
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
            <!-- <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据 -->
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click.stop="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
    </div>
    <template #footer>
      <el-button type="primary" @click="submitFileForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>
  </el-dialog>
</template>


<script>
import index from './index.js';
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
