<template>
  <div class="addressBox" v-if="menu.choose && menu.choose.address">
    <template v-for="(item, i) in menu.choose.address" :key="i">
      <div class="one">{{item.title}}</div>
      <span v-if="i < menu.choose.address.length - 1" class="icon iconfont icon-jiantou-you"></span>
    </template>
  </div>
</template>

<script>
import index from './index.js';
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
