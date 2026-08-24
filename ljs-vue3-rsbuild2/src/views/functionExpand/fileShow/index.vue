<template>
  <div class="childPage" :style="'height: ' + win_h + 'px;'">
    <div>
      <file-upload
        :limit="10"
        :fileSize="50"
        :dataType="false"
        v-model="profileUploadList"
      />
    </div>
    <div>
      <FilePreview
        :files="files"
      />
    </div>
  </div>
</template>

<script>
import index from "./index.js";
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
