<!--
 * @Author: ljs
 * @LastEditors: ljs
 * @description: ?
 * @updateInfo: 内容:
 * @Date: 2023-05-06 15:28:02
 * @LastEditTime: 2023-05-06 15:28:02
-->
<template>
  <div class="menuZJ" ref="menuShrink" v-if="menu.choose !== null">
    <div class="one" v-for="(item, i) in menuList" :key="i">
      <div class="f"
        :class="{
          active: item.choose
        }"
        @click="menuCF(item)"
        :style="{
          // '--fPaddingLeft': `${shrink ? 15 : 20 * item.level}px`
          '--fPaddingLeft': `${shrink ? (item.level < 2 ? 15 : 20 * (item.level - 1)) : 20 * item.level}px`
        }">
        <!-- <span class="ico iconfont" :class="item.icon !== '' ? item.icon : 'absent'"></span> -->
        <el-tooltip
          effect="dark"
          :content="item.title"
          placement="top"
          :show-after="500"
          v-if="shrink && item.level < 2"
        >
          <svg-icon
            class="ico"
            :iconName="item.icon !== '' ? item.icon : 'absent'"
            :style="{
              margin: `18px 5px 0px ${shrink && item.level < 2 ? 10 : 0}px`,
            }">
          </svg-icon>
        </el-tooltip>
        <svg-icon
          v-else
          class="ico"
          :iconName="item.icon !== '' ? item.icon : 'absent'"
          :style="{
            margin: `18px 5px 0px ${shrink && item.level < 2 ? 10 : 0}px`,
          }">
        </svg-icon>
        <span class="name" v-if="!shrink || (shrink && item.level > 1)">{{item.title}}</span>
        <span v-if="item.children.length > 0 && (!shrink || (shrink && item.level > 1))" class="jt iconfont icon-35_xiangxiajiantou" :class="item.open?'zhuan':'hui'"></span>
      </div>
      <div v-if="item.children.length > 0 && item.open && (!shrink || (shrink && item.level > 1))" class="c" :class="{ open: item.open }">
        <CMenu
          v-if="item.children && item.children.length > 0"
          v-model="item.children"
          :shrink="shrink">
        </CMenu>
      </div>
      <div
        v-if="item.children.length > 0 && (shrink && item.level <= 1)"
        class="c2"
        :style="{
          height: `${menuC2_h}px`,
          top: (60 + i * 50 + 2 + menuC2_h) < win_h ? `${60 + i*50 + 2}px` : 'auto',
          bottom: (60 + i * 50 + 2 + menuC2_h) < win_h ? `auto` : '2px',
        }">
        <el-scrollbar>
          <CMenu
            v-if="item.children && item.children.length > 0"
            v-model="item.children"
            :shrink="shrink">
          </CMenu>
        </el-scrollbar>
      </div>
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
