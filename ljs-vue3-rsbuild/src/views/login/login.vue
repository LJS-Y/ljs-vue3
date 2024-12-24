<template>
  <div class="login">
    <div class="logoBox">
      <div class="logo">{{ projectName }}</div>
      <div class="login-form-box">
        <div class="bg"></div>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
          <div class="formTitle">用户登录</div>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号" :maxlength="30">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter="handleLogin"
              :maxlength="30"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="code" v-if="captchaOnOff">
            <el-input
              v-model="loginForm.code"
              auto-complete="off"
              placeholder="验证码"
              class="code-input"
              @keyup.enter="handleLogin"
              :maxlength="10"
            >
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" class="login-code-img"/>
            </div>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" style="margin:0rem auto 1.5625rem;">记住密码</el-checkbox>
          <el-form-item style="margin: 0 auto;">
            <el-button
              size="default"
              type="primary"
              style="width:100%;"
              @click.prevent="handleLogin"
            >
              <span v-if="!$store.state.loading.tag">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
            <div class="register" v-if="register" @click="$run.push({
              path: '/register'
            })">立即注册</div>
          </el-form-item>
        </el-form>
      </div>
      <!--  底部  -->
      <div class="el-login-footer">
        <span>技术支持：{{ copyrightName }}</span>
      </div>
    </div>
    <particles></particles>
  </div>
</template>

<script>
import login from './login.js';
export default login;
</script>

<style lang="scss" scoped>
@import "./login.scss";
</style>
