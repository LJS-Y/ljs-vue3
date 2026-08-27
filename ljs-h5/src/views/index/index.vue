<template>
  <div class="comPage">
    <div class="logout" @click="logoutF">退出登录</div>
    <div>AI</div>
    <van-tag
      class="tabs"
      type="primary"
      v-for="(item, i) in modules_aiData" :key="i"
      @click="this.$run.push({
        path: item.path
      })">{{ item.meta.title }}</van-tag>
    <van-divider />
  </div>
</template>

<script>
import index from "./index.js";
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
