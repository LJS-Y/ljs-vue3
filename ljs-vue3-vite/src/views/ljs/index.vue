<template>
  <div class="childPage">
    <p>欢迎使用ljs-vue3框架。</p>
    <p>起初若依没有出vue3的分离板，他们可能正在做这个事情，而我们需要一个vue3的版本满足老板和客户的要求，所以我就开始着手准备。</p>
    <p>后来若依有了vue3的分离板，用的是ts！我的天哪！我不会这个玩意呀！我学不会呀！怎么办呀！我只好继续努力完善之前的工程。</p>
    <p>so，你看到了，有了它！</p>
    <p>若依原有的，它应该都有的哦。</p>

    <h1 @click="$run.goExternalUrl('https://frame-project.gitlab.io/nv3-ljs-tools/')" style="font-size: 20px; font-weight: bold; cursor: pointer;">官方文档</h1>

    <h1 @click="$run.goExternalUrl('https://frame-project.gitlab.io/nv3-ljs-tools/callMe.html')" style="font-size: 20px; font-weight: bold; cursor: pointer;">请作者喝杯卡布奇诺</h1>
  </div>
</template>

<script>
import index from "./index.js";
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
