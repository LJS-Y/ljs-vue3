<template>
  <!-- aria-hidden：默认为false，设置为true表示会把整个元素包括子元素从可访问树（AOM）上移除，但是在DOM树上还是存在的 -->
  <!-- fill：如果在动画接收还需要保持动画的值，可用于设置颜色 -->
  <svg :class="'svg-icon ' + ($attrs.iconClass ? $attrs.iconClass : '')" aria-hidden="true">
    <use class="svg-use" :href="'#' + $attrs.iconName" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  // 启用了类型推导
  props: {
  },
  data() {
    return {
    }
  },
  mounted() {
  }
})
</script>
<style scope>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>