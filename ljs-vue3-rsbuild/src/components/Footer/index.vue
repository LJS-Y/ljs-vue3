<template>
  <!--  底部  -->
  <div class="el-login-footer"
    :style="{
      bottom,
    }">
    <span>
      <!-- Copyright ©宁夏长城水务有限责任公司  -->
      <span class="active" @click="$run.goExternalUrl('https://beian.miit.gov.cn')">{{ copyright }}</span> 技术支持：{{ copyrightName }}
    </span>
  </div>
</template>

<script>
import index from './index.js';
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

