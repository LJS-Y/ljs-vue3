<template>
  <div class="fileShow">
    <div class="item"
      v-for="(item, i) in files" :key="i">
      <el-tooltip
        effect="dark"
        :content="item.name"
        placement="top"
        :show-after="500"
      >
        <el-tag
          class="tag"
          type="info"
          @click="tcOpen(item)"
          >{{ 
            $LJSurl.getFileName(item.name).length <= fileNameNumber ? $LJSurl.getFileName(item.name) : $LJSurl.getFileName(item.name).slice(0, fileNameNumber) + '...'
          }}{{ $LJSurl.getFileType(item.name) }}</el-tag>
      </el-tooltip>
    </div>
  </div>
  <el-dialog
    v-model="tc.open"
    :title="tc.title"
    width="80%"
    top="5vh"
    append-to-body
    class="filesTc"
  >
    <template v-if="tc.fileType === 'image'">
      <img
        class="image-preview"
        :src="tc.row.url"
      />
    </template>
    <!-- <template v-else-if="tc.fileType === 'pdf'">
      <VuePdfEmbed class="pdfBox" :source="tc.pdf.data" :page="tc.pdf.page" @loaded="initPdf" />
      <pagination
        v-if="tc.pdf.total > 0"
        :total="tc.pdf.total"
        layout="prev, pager, next"
        v-model:page="tc.pdf.page"
        v-model:limit="tc.pdf.pageSize"
        @pagination="pdfNext"
      />
    </template> -->
    <template v-else-if="tc.fileType === 'video'">
      <video controls class="video-preview">
        <source :src="tc.row.url" type="video/mp4" />
        您的浏览器不支持视频播放。
      </video>
    </template>
    <!-- <template v-else-if="tc.fileType === 'word'">
      word
    </template> -->
    <template v-else>
      <div class="other-preview">
        <div class="promptInformain">暂不支持预览，请点击下载</div>
        <el-button type="success"
          @click="$run.goExternalUrl(tc.row.url)"
        ><el-icon class="el-icon--left"><Download /></el-icon>下载文件</el-button>
      </div>
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

