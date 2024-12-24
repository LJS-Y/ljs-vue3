<template>
  <div class="childPage" :style="'height: ' + win_h + 'px;'">
    <div class="top">
      <div class="module">
        <div class="title">
          <span class="name">城市占比<span class="small">本年</span></span>
        </div>
        <div class="con">
          <div class="report">
            <div class="ec" id="getPie1"></div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">
          <span class="name">开发占比<span class="small">本年</span></span>
        </div>
        <div class="con">
          <div class="report">
            <div class="ec" id="getPie2"></div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">
          <span class="name">性别占比<span class="small">本年</span></span>
        </div>
        <div class="con">
          <div class="report">
            <div class="ec" id="getPie3"></div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">
          <span class="name">下载曲线<span class="small">本年</span></span>
        </div>
        <div class="con">
          <div class="report">
            <div class="ec" id="getLine1"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="midd">
      <div class="module">
        <div class="title">
          <span class="name">版本使用曲线<span class="small">本年</span></span>
        </div>
        <div class="con">
          <div class="report">
            <div class="ec" id="getLine2"></div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">
          <span class="name">领域使用情况<span class="small">本年</span></span>
        </div>
        <div class="con">
          <div class="report">
            <div class="ec" id="getLine3"></div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">
          <span class="name">版本更新<span class="small">本年</span></span>
        </div>
        <div class="con">
          <div class="report">
            <div class="ec" id="getBar1"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="module">
        <div class="title">
          <span class="name">bug预警<span class="small">本年</span></span>
        </div>
        <div class="con">
          <div class="report">
            <div class="ec" id="getBar2"></div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">
          <span class="name">版本更新<span class="small">本年</span></span>
        </div>
        <div class="con">
          <div class="report">
            <div class="ec" id="getBar3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import index from "./index.js";
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
