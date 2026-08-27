<script setup lang="ts">
defineOptions({
  name: 'HTMLBox',
})
const props = defineProps({
  content: String
})

onMounted(() => {})
</script>

<template>
  <div
    class="html"
    v-html="content"
  ></div>
</template>

<style scoped lang="scss">
@use './index';
</style>
