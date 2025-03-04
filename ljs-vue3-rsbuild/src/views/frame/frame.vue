<template>
  <div class="framePage">
    <div class="top">
      <div class="left" @click="goMainApp" ref="moduleLogoBox">
        <img class="logo" src="@/assets/images/logo.png"/>
        <div class="title">
          <div class="font">{{projectName}}</div>
          <!-- <div class="line"></div>
          <div class="font">{{subtitle}}</div> -->
        </div>
      </div>
      <div class="midd"
        ref="moduleMenuBox"
        :style="{
          width: moduleMenu.width + 'px'
        }">
        <template v-for="(item, i) in moduleMenu.showData" :key="i">
          <div class="item" :class="{ active: i === 0 }">
            <svg-icon class="icon" :iconName="item.icon !== ''?item.icon:'absent'"></svg-icon>
            <span class="name">{{item.name}}</span>
          </div>
        </template>
        <el-dropdown v-if="moduleMenu.showData.length < moduleMenu.data.length" trigger="click">
          <div class="item more">
            <span class="icon iconfont icon-diandiandianshu"></span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logoutF"  v-for="(item, i) in moduleMenu.hideData" :key="i"><i class="iconfont" :class="item.icon !== ''?item.icon:'absent'"></i>{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="right" ref="userInfoBox">
        <div class="khMenu">
          <div class="but" @click.stop="fullscreen">
            <span class="icon iconfont" :class="control.full?'icon-tuichuquanping':'icon-quanping'"></span>
          </div>
          <el-dropdown>
            <div class="but">
              <span class="icon iconfont icon-bucket"></span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="changeSkin('default')" :style="{color: skin.value === 'default' ? '#1890FF' : ''}">默认</el-dropdown-item>
                <el-dropdown-item @click="changeSkin('black')" :style="{color: skin.value === 'black' ? '#1890FF' : ''}">黑色</el-dropdown-item>
                <el-dropdown-item @click="changeSkin('green')" :style="{color: skin.value === 'green' ? '#1890FF' : ''}">绿色</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="info">
          <img class="head" @click="goUserInfo" :src="userinfo.avatar" @error="$base.picError({form: userinfo, key: 'avatar', img: '@/assets/images/common/head.png'})"/>
          <div class="name">{{userinfo.nickName}}</div>
          <div class="org" v-if="userinfo.dept && userinfo.dept.deptName">{{userinfo.dept.deptName}}</div>
          <el-dropdown class="jt">
            <span class="iconfont icon-35_xiangxiajiantou"></span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logoutF"><i class="iconfont icon-logout"></i>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="mainBox">
      <!-- 菜单 -->
      <div class="menu" ref="menuShrink">
        <el-scrollbar>
          <Menu
            v-if="menu.list && menu.list.length > 0"
            :shrink="menu.shrink"
            v-model="menu.list">
          </Menu>
        </el-scrollbar>
      </div>
      <div class="main" ref="mainShrink">
        <!-- 菜单导航 -->
        <!-- <div class="address">
          <span @click="menuShrink" class="jt iconfont" :class="menu.shrink?'icon-zhankaicebianlan2x':'icon-shouqicebianlan2x'"></span>
          <Address></Address>
        </div> -->
        <!-- 历史卡片 -->
        <div class="tab">
          <div class="menuShrink">
            <el-tooltip
              effect="dark"
              :content="`${menu.shrink ? '展开' : '收起'}左侧菜单`"
              placement="top"
              :show-after="500"
            >
              <span @click="menuShrink" class="jt iconfont" :class="menu.shrink?'icon-zhankaicebianlan2x':'icon-shouqicebianlan2x'"></span>
            </el-tooltip>
          </div>
          <div class="tabs">
            <div @click="moveTabBox(-1)" class="left" v-if="menu.tabListJtShow"><el-icon><ArrowLeft /></el-icon></div>
            <div class="midd" ref="tabsMidd" :style="'width: calc(100% - '+ (menu.tabListJtShow ? 40 : 0) +'px);'">
              <div class="tabsBox" :style="'width: '+ menu.tabListW +'px; transition: margin-left 0.5s; margin-left: '+ menu.tabBoxMove +'px;'">
                <div class="one"
                :class="menu.choose.url === item.url?'active':''"
                ref="tab"
                @mouseenter="addClassName('tab', i, item)"
                @mouseleave="removeClassName('tab', i, item)"
                @click="tabCF(item)"
                @contextmenu.prevent="rightMenu($event, i, item)"
                v-for="(item, i) in menu.tabList" :key="i">
                  <!-- <span class="ico iconfont" :class="item.icon !== '' ? item.icon : 'absent'"></span> -->
                  <svg-icon class="ico" :iconName="item.icon !== '' ? item.icon : 'absent'"></svg-icon>
                  <span class="name">{{item.title}}</span>
                  <span v-if="menu.tabList.length > 1" @click.stop="tabClose(i, menu.choose.url === item.url)" class="close iconfont icon-guanbi1"></span>
                </div>
              </div>
            </div>
            <div @click="moveTabBox(1)" class="right" v-if="menu.tabListJtShow"><el-icon><ArrowRight /></el-icon></div>
          </div>
          <RightMenu v-model="menu.rightMenu.show" :opts="menu.rightMenu.opts">
            <!-- <div class="item" v-if="menu.rightMenu.menuChoose === 1" @click="tabCloseRefresh">
              <span class="icon iconfont icon-shuaxin"></span>
              <span class="name">重新加载</span>
            </div> -->
            <div class="item" v-if="menu.rightMenu.menuChoose === 2" @click="tabCloseChoose">
              <span class="icon iconfont icon-guanbi1"></span>
              <span class="name">关闭当前标签页</span>
            </div>
            <div class="item"
              :class="{
                disable: menu.rightMenu.i === 0
              }"
              @click="menu.rightMenu.i === 0 ? '' : tabCloseLeft()">
              <span class="icon iconfont icon-cs-jt-xz-1-1"></span>
              <span class="name">关闭左侧标签页</span>
            </div>
            <div class="item"
              :class="{
                disable: menu.rightMenu.i === menu.tabList.length - 1
              }"
              @click="menu.rightMenu.i === menu.tabList.length - 1 ? '' : tabCloseRight()">
              <span class="icon iconfont icon-cs-jt-xy-1-1"></span>
              <span class="name">关闭右侧标签页</span>
            </div>
            <div class="item"
              :class="{
                disable: menu.tabList.length === 1
              }"
              @click="menu.tabList.length === 1 ? '' : tabCloseOther()">
              <span class="icon iconfont icon-OA-ohter-9"></span>
              <span class="name">关闭其他标签页</span>
            </div>
            <div class="item" @click="tabCloseAll">
              <span class="icon iconfont icon-jian"></span>
              <span class="name">关闭全部标签页</span>
            </div>
          </RightMenu>
          <div class="tabControl">
            <el-dropdown>
              <div class="icon"
              ref="tabControlIcon"
              @mouseenter="tabControlIconAddClassName('tabControlIcon')"
              @mouseleave="tabControlIconRemoveClassName('tabControlIcon')">
                <i class="box1"></i>
                <i class="box2"></i>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="tabCloseChoose" v-if="menu.tabList.length > 1"><i class="el-icon-back"></i>关闭当前标签页</el-dropdown-item>
                  <el-dropdown-item :disabled="menu.chooseIndex === 0" @click="tabCloseLeft"><i class="el-icon-back"></i>关闭左侧标签页</el-dropdown-item>
                  <el-dropdown-item :disabled="menu.chooseIndex === menu.tabList.length - 1" @click="tabCloseRight"><i class="el-icon-right"></i>关闭右侧标签页</el-dropdown-item>
                  <el-dropdown-item :disabled="menu.tabList.length === 1" @click="tabCloseOther"><i class="el-icon-close"></i>关闭其他标签页</el-dropdown-item>
                  <el-dropdown-item @click="tabCloseAll"><i class="el-icon-back"></i>关闭全部标签页</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <Transition name="fade">
          <div class="page" v-show="control.pageAnimation">
            <el-scrollbar>
              <!--
                <keep-alive> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们
                当组件在 <keep-alive> 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。
              -->
              <!-- <keep-alive :include="keepAliveList"
                v-if="$route.meta.keepAlive && $route.meta.keepAlive === true"
              >
                <router-view></router-view>
              </keep-alive>
              <router-view v-else></router-view> -->
              <router-view v-slot="{ Component }" @customSonComponent_close="tabClose">
                <keep-alive :include="keepAliveList">
                  <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive && $route.meta.keepAlive === true" />
                </keep-alive>
                <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
              </router-view>
            </el-scrollbar>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script>
import frame from './frame.js';
export default frame;
</script>

<style lang="scss" scoped>
@import "./frame.scss";
</style>
