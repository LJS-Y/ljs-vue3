<template>
  <div class="top">
    <img class="bg" src="@/assets/images/cockpit/common/projectNameBg.png"/>
    <div class="projectName">
      <img class="logo" src="@/assets/images/logo.png"/>
      <div class="title">{{ projectName }}</div>
    </div>
    <div class="left">
      <el-tooltip
        popper-class="tooltip_cockpitIndex"
        effect="light"
        content="返回主平台"
        placement="top"
      >
        <div @click="goMainApp" class="item iconfont icon-shouyefill"></div>
      </el-tooltip>
      <el-tooltip
        v-if="backOpen"
        popper-class="tooltip_cockpitIndex"
        effect="light"
        content="驾驶舱首页"
        placement="top"
      >
        <div @click="$run.replace({
          path: '/cockpit'
        })" class="item iconfont icon-back"></div>
      </el-tooltip>
    </div>
    <div class="right">
      <div class="datetime">{{ datetime.value }}</div>
    </div>
  </div>
</template>

<script>
import index from './index.js';
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

