<template>
  <div class="comPage">
    <div class="box">
      <div class="title">哎呀，你访问的网站走丢了</div>
      <div class="dis">您可以尝试刷新页面</div>
      <button @click="goIndex" class="but">刷新</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error',
  data() {
    return {};
  },
  created() {},
  methods: {
    // 回首页
    goIndex() {
      this.$run.replace({
        path: '/'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/404.scss";
</style>
