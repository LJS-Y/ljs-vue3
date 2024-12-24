<template>
  <div
    id="app"
    :class="{
      grayStyle: grayStyle
    }"
    :style="{
      '--frame_topBg': frameTheme.frame_topBg,
      '--frame_menuBg': frameTheme.frame_menuBg,
      '--frame_moduleMenuBg': frameTheme.frame_moduleMenuBg,
      '--menu_hoverBg': frameTheme.menu_hoverBg,
      '--menu_oneTitleColor': frameTheme.menu_oneTitleColor,
      '--menu_oneTitleHoverColor': frameTheme.menu_oneTitleHoverColor,
      '--tabs_activeColor': frameTheme.tabs_activeColor,
      '--tabs_activeBgColor': frameTheme.tabs_activeBgColor,
    }"
  >
    <LJSLoading v-if="$store.state.loading.tag">{{$store.state.loading.text}}</LJSLoading>
    <router-view />
  </div>
</template>

<script>
import skinSdk from '@/tools/skin';
export default {
  data() {
    return {
      grayStyle: window.g.grayStyle,
      frameTheme: {}
    };
  },
  mounted() {
  },
  created() {
    this.$base.screenListen();
    this.$LJSbase.setRemUnit();
    this.init();
  },
  watch: {
    // 浏览器窗口宽度变化监听
    '$store.getters.screenWidth': {
			handler(n) {
        this.$LJSbase.setRemUnit();
        this.$base.checkWindowRatio();
			},
			deep: true
    },
    // 监听主题皮肤
    '$store.getters.frameTheme': {
			handler(n) {
        this.changeSkin();
			},
			deep: true
    }
  },
  methods: {
    changeSkin() {
      const skinColors = skinSdk(this.$store.getters.frameTheme);
      this.frameTheme = skinColors;
    },
    init() {
      this.changeSkin();
    }
  }
};
</script>

