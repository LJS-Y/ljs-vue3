/** 
 * @module base
 * @description 基础常用处理方法
 *  */
import store from '@/store/index.js';
import { LJSbase, LJSsession, LJSurl } from 'ljs-tools';
import msg from '@/tools/msg'

/**
 * token检验
 * @param id 文件ID
 * @returns 返回可获取的文件地址
 * @example this.$base.checkToken()
 */
export function checkToken(to) {
  // 默认所有路由需要检测，urlList为屏蔽项，这里面的路由不用检测
  const whitelist = ['/404']
  if (import.meta.env.PUBLIC_CURRENTMODE === 'development') {
    whitelist.push('/')
  }
  
  if (whitelist.indexOf(to.path) === -1) {
    
    let token = LJSurl.getUrlParameter('token'); // 只要地址有token，就更新token
    if (LJSbase.fieldCheck(token)) {
      token = store.getters.token; // 地址没有token，从状态中取
      // 开发模式：自动存入token，生产从地址中获取
      if (import.meta.env.PUBLIC_CURRENTMODE === 'development') {
        token = ''
        // 开发模式可修改
        // token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJETC1XSU5FLTIwMjYwODEzMTEwMjQ4NzY5MSIsImxvZ2luX3VzZXJfa2V5IjoiNTIzNGVmMDEtZjU0ZS00OTVjLTkwMzEtYWYxNzI4MzkxZTQzIn0.AuCBTyaLb3Zjhds8ELN3nOdLfuYiDjoLr-50y2nN_KEtEuB2khPWwFv4UREnAdZI9_e08o0A0DJCHXkaochiQg'
      }
    }
    
    // token存在，存储
    if (!LJSbase.fieldCheck(token)) {
      store.commit('SET_token', token);
    } else {
      // msg.info('请先授权')
      return false;
    }
  }

  // 开发模式：自动存入token，生产从地址中获取
  if (import.meta.env.PUBLIC_CURRENTMODE === 'development') {
    // LJSsession.setSS('smSwitch', '1');
    // LJSsession.setSS('ljs_a', '0429d443e1d07a544b26b10e78df312b7a40aee85d4e65d140170314a5bd3c01724464939845bb72655062320ee01c45a9a6d9d78f2b7a16690bd20d6c95045d9d');
    // LJSsession.setSS('ljs_b', '3563705a077599d3c7c7b5bf55f84ff25e4ab6ede4f7ab0f539b2f057df872eb');
  } else {
    // 从小程序获取国密数据
    const smSwitch = LJSurl.getUrlParameter('smSwitch');
    if (!LJSbase.fieldCheck(smSwitch) && smSwitch === '1') {
      const ljs_a = LJSurl.getUrlParameter('ljs_a');
      const ljs_b = LJSurl.getUrlParameter('ljs_b');
      LJSsession.setSS('smSwitch', smSwitch);
      LJSsession.setSS('ljs_a', ljs_a);
      LJSsession.setSS('ljs_b', ljs_b);
    }
  }

  // 获取 app_mode
  let appMode = LJSurl.getUrlParameter('app_mode');
  if (!LJSbase.fieldCheck(appMode)) {
    store.commit('SET_appMode', appMode);
  }
  return true;
}

export default {
  checkToken,
};

