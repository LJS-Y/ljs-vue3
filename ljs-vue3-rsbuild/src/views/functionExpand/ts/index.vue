<template>
  <div class="comPage">
    ts版：喜欢ts。或需要组合式可用的API时，使用该版本。后期会增加ts版的增删查改模板，敬请期待。
  </div>
</template>

<script setup lang="ts">
  onMounted(() => {
    initData();
  });
  async function initData() {
    console.log('ts版');
  }
  defineExpose({
    initData
  })
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
