import { LJSbase, LJSsession, LJSsm } from 'ljs-tools';
const smCryptoOpen = import.meta.env.VITE_APP_SM_CRYPTO === '1';

// 加密白名单
const whitelistEncrypt = [
  // '/api/activity/info'
]
// request 加密
export function requestEncrypt (config) {
  if (!smConfigCheck()) return
  let { url: apiUrl, method } = config;
  if (whitelistCheck(whitelistEncrypt, apiUrl)) return // apiUrl 白名单不拦截
  if (LJSbase.fieldCheck(config)) return
  const a = LJSsession.getSS('wine_a');
  if (LJSbase.fieldCheck(a)) return
  let { data: tempData } = config;
  // put post
  if (apiUrl.startsWith('/api/') && (method === 'post' || method === 'put')) {
    const sm4Key = LJSsm.SM4Util.generateKey()
    const newData = LJSsm.SM4Util.encrypt(JSON.stringify(tempData), sm4Key)
    config.data = {
      sm4Key: LJSsm.SM2Util.encrypt(sm4Key, a),
      data: newData,
    }
  }
}

// 解密白名单
const whitelistDecrypt = [
  // '/api/activity/info'
]
// respone 解密
export function responeDecrypt (response) {
  if (!smConfigCheck()) return
  if (LJSbase.fieldCheck(response)) return
  let { data, data: {encrypted, sm4Key: sm4KeySecret}, config: { method, url: apiUrl } } = response;
  if (whitelistCheck(whitelistDecrypt, apiUrl)) return // apiUrl 白名单不拦截
  const b = LJSsession.getSS('wine_b');
  if (LJSbase.fieldCheck(b)) return
  // sm-crypto 需要小写
  if (!LJSbase.fieldCheck(sm4KeySecret)) {
    sm4KeySecret = sm4KeySecret.toLowerCase();
    // 移除开头04前缀（Hutool自带，sm-crypto内部自动补04，重复会解析失败）
    if (sm4KeySecret.startsWith('04')) sm4KeySecret = sm4KeySecret.slice(2);
  }
  
  // 需要解密
  if (apiUrl.startsWith('/api/') && encrypted === true && (method === 'post' || method === 'put')) {
    const sm4Key = LJSsm.SM2Util.decrypt(sm4KeySecret, b)
    const dataDecrypt = LJSsm.SM4Util.decrypt(data.data, sm4Key)
    // console.log('解密后端：sm4Key', sm4Key);
    // console.log('解密后端：data.data', dataDecrypt);
    // 可能存在疑问，dataDecrypt解密后是否需要JSON.p
    data.data = dataDecrypt;
  }
}

// 检测是否在白名单中
function whitelistCheck(whitelist, apiUrl) {
  for (const one of whitelist) {
    if (one === apiUrl) {
      return true
    }
  }
  return false
}

// 检测是否打开国密配置
function smConfigCheck() {
  if (!smCryptoOpen) {
    LJSsession.delSS('wine_a');
    LJSsession.delSS('wine_b');
  }
  return smCryptoOpen
}