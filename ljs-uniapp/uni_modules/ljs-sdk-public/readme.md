# 方便您的同时，请五星、收藏，让好的东西照亮更多深渊中负重前行的代码人。
# 创作不易，在您方便之际，赞赏作者，我们会更有动力继续下去。

# 简介
提供一套常用的实战性JS-JDK，提高开发效率。

# 使用方法
### 1.全局注入
```js
// 全局注入公共JS-SDK
import ljsPublic from './uni_modules/ljs-sdk-public/js_sdk/index.js'
Vue.prototype.$ljsPublic = ljsPublic;
```
### 2.使用
```js
// base库
this.$ljsPublic.base.urlCheck('userId')
```

# API
[API文档](https://frame-project.gitlab.io/nv3-ljs-tools/ljs-vue3/buildTools/uniapp/)

## 基础开发库：
### 1.公共封装（base）
### 2.日期处理封装（date）
### 3.数字处理封装（number）
### 4.表单检查（formCheck）
### 5.消息封装（msg）
### 6.跳转封装（run）
### 7.动画封装（animation）
### 8.加密解密（cryptoJs）
1.安装插件crypto-js
```js
npm i crypto-js -S
```
### 9.请求封装（request）
1.main.js配置全局变量$API;
```js
// API
import ljsAPI from '@/request/index.js'
Vue.prototype.$API = ljsAPI;
```
2.根目录创建文件
request/config.js;
```js
/**
 * 配置：API访问地址
 * */
const technical_support = "龙九山"; // 技术支持
//测试 - 
export default {
  base_url: 'http://192.168.1.100:8080', // 接口地址
	technical_support,
}

```
request/index.js;
```js
import common from './module/common';
import system from './module/system';

export default {
  common, // 公共
  system // 系统管理
};
```
3.根目录创建文件request/module/common.js;
```
import { get, post } from '@/uni_modules/ljs-sdk-public/js_sdk/utils/request/index.js';

const api = {
  // 登录
  login: (params) => {
    return post('/login', params);
  }
};

export default api;
```
4.调用方法;
```
this.$API.common.login({
	username: 'ljs',
	password: '123456'
}).then((res) => {
	console.log(res);
	if (res.code === 200) {
	}
});
```
5.请求需要验证token，登录接口需要存储token
```
this.$store.commit('SET_token', res1.token);
```

### request方法

参数  | 类型| 解释
---- | ----- | :------ 
login(url, params = {}) | Function | 独立，只在登录使用，绕过header["Authorization"] 
get(url, params = {}) | Function | GET
post(url, params = {}, submitDD, timeout) | Function | POST
put(url, params = {}, submitDD, timeout) | Function  | PUT
del(url, params = {}, submitDD) | Function | DELETE
uploadFile(url, filePath, timeout) | Function | 

### request方法参数
参数  | 类型| 必填项 | 默认值 | 说明
---- | ----- | ----- | ----- | :------ 
url | string | √ |  | 接口地址 
params | Object | × | {} | 参数的对象 
submitDD | Boolean | × | false | 防抖动，是否需要开启 
timeout | Number | × | 10000 | 超时时间，默认6000毫秒 
 

# 贡献代码
龙九山。有任何问题，请在平台留言，在手头宽裕得情况下，我会尽快修复问题。
