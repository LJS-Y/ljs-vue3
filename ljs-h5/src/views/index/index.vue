<template>
  <div class="comPage">
    <van-tag
      type="primary"
      v-for="(item, i) in 10" :key="i"
      @click="this.$run.push({
        path: item.path
      })">111</van-tag>
  </div>
</template>

<script>
import index from "./index.js";
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
