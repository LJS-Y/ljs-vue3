<template>
  <div class="login">
    <div class="moduleGuide">
      <div class="title"><span>{{ projectName }}</span></div>
      <div class="logout" @click="logoutF">
        <img src="@/assets/images/moduleGuide/logout.png"/>
        <span>退出</span>
      </div>
    </div>

    <BallSwiper
      class="swiper"
      :data="module.data"
      height="19rem"
      @itemClick="$base.itemClick">
      <template #default="scope">
        <div class="name">{{ scope.row.moduleName }}</div>
        <div class="img">
          <img :src="scope.row.imgUrl">
        </div>
      </template>
    </BallSwiper>

    <Footer></Footer>
  </div>
</template>

<script>
import index from '.';
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
