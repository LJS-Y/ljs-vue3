<template>
  <div class="comPage">
    <div class="logo">{{ projectName }}</div>
    <div class="login-form-box">
      <van-form @submit="handleLogin">
        <van-cell-group>
          <van-field
            v-model="loginForm.username"
            name="username"
            label="账号"
            placeholder="请输入账号"
            clearable
            :maxlength="30"
            left-icon="manager"
            :rules="[{ required: true, message: '请输入您的账号' }]"
          />
          <van-field
            v-model="loginForm.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            clearable
            :maxlength="30"
            left-icon="lock"
            :rules="[{ required: true, message: '请输入您的密码' }]"
          />
          <van-field
            v-if="captchaOnOff"
            v-model="loginForm.code"
            name="code"
            label="验证码"
            placeholder="请输入验证码"
            clearable
            :maxlength="10"
            left-icon="umbrella-circle"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <template #button>
              <img
                v-if="codeUrl"
                :src="codeUrl"
                class="login-code-img"
                @click="getCode"
              />
              <van-button
                v-else
                size="small"
                type="primary"
                plain
                native-type="button"
                @click="getCode"
              >获取验证码</van-button>
            </template>
          </van-field>
        </van-cell-group>

        <div class="login-options">
          <van-checkbox v-model="loginForm.rememberMe" shape="square" icon-size="14px">记住密码</van-checkbox>
        </div>

        <div class="login-submit">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="$store.state.loading.tag"
            loading-text="登录中..."
          >登录</van-button>
          <div
            v-if="register"
            class="register"
            @click="$run.push({ path: '/register' })"
          >立即注册</div>
        </div>
      </van-form>
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
