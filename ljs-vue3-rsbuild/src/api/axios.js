// 引入axios
import store from '@/store/index.js';
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus';
import { LJSbase, LJSsession } from 'ljs-tools';
import run from '@/tools/run.js';
import apiQC from '@/tools/apiQueryChange.js';
import { tansParams, blobValidate } from "@/tools/ruoyi/ruoyi.js";
import { saveAs } from 'file-saver'
const BASEURL = import.meta.env.PUBLIC_API_URL;
let tokenGq = false; // token是否过期
// 创建axios实例
const httpService = axios.create({
  withCredentials: false, // 允许携带cookie
  baseURL: BASEURL,
  timeout: window.g.API_OUT_TIME, // 请求超时时间 - 6s
  // transformRequest: [
  //   // `transformRequest` 允许在向服务器发送前，修改请求数据
  //   // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  //   // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  //   data => {
  //     var fData = new FormData();
  //     for(let key in data){
  //       fData.append(key, data[key]);
  //     }
  //     return fData
  //   }
  // ],
  // 修改请求头信息
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded'
    // 'Content-Type': 'multipart/form-data'
    'Content-Type': 'application/json;charset=utf-8'
  }
});
// 当需要取消请求时，用cancel()来取消请求
// httpService.defaults.withCredentials = true; // 表示跨域请求时是否需要使用凭证
// http request 拦截器
httpService.interceptors.request.use(
  (config) => {
    let { headers, params, url, method } = config;
    // 所有请求添加token字段
    const token = store.getters.token;
    if (token !== null && url !== '/login') {
      headers.Authorization = 'Bearer ' + token;
    }
    // get请求映射params参数
    if (method === 'get' && params) {
      params = {};
      config.url = (url + '?' + tansParams(params)).slice(0, -1);
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
// respone拦截器
httpService.interceptors.response.use(
  (response) => {
    const { data, data: {code, msg} } = response;
    if (!code) {
      return data; // 流数据
    }
    if (code === 200) {
      tokenGq = false;
    } else if (code === 401) {
      if (!tokenGq) {
        ElMessage.info('您的访问权限已过期，请重新登录！');
        tokenGq = true;
      }
      LJSsession.clearVuex(store);
      run.replace({
        path: '/login'
      });
      return data; // 流数据
    } else if (code !== 200 && code !== 401) {
      // console.error('服务出错：', LJSbase.fieldCheck(msg) ? '未知错误。' : msg);
      // ElMessage.warning('服务异常，请联系客服或稍后重试！');
      ElMessage.warning(LJSbase.fieldCheck(msg) ? '未知错误。' : msg);
      store.commit('loadingStore', {
        tag: false,
        text: '加载中....'
      });
      // 全局的数据 加载中.... - 开关
      store.commit('openSubmitDDTag', false); // 防抖动 - 开关
    }
    return data; // 响应正确的数据
  },
  (error) => {
    // 响应错误数据(错误情况分无token信息,错误码)
    const { response } = error;
    if (response) {
      switch (error.response.status) {
        case 400:
          error.message = '错误请求';
          break;
        case 401:
          error.message = '未授权，请重新登录';
          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          error.message = '请求错误,未找到该资源';
          break;
        case 405:
          error.message = '请求方法未允许';
          break;
        case 408:
          error.message = '请求超时';
          break;
        case 500:
          error.message = '服务器端出错';
          break;
        case 501:
          error.message = '网络未实现';
          break;
        case 502:
          error.message = '网络错误';
          break;
        case 503:
          error.message = '服务不可用';
          break;
        case 504:
          error.message = '网络超时';
          break;
        case 505:
          error.message = 'http版本不支持该请求';
          break;
        default:
          error.message = `未知错误${error.response.status}`;
      }
    } else {
      error.message = '请求超时';
    }
    store.commit('loadingStore', {
      tag: false,
      text: '加载中....'
    }); // 全局的数据 加载中.... - 开关
    store.commit('openSubmitDDTag', false); // 防抖动 - 开关
    console.error(error.message);
    if (error.msg === undefined) {
      ElMessage.error('服务异常，请稍候重试！');
    } else {
      ElMessage.error(error.msg + '，请稍候重试！');
    }
  }
);

/*
 *  熔断监测（内部方法）
 *  url: 接口地址
 *  params: 参数，格式如下
 * */
function apiShakeCheck(url, params = {}) {
  // 根据请求url和参数，进行抖动熔断
  let apiShake = true;
  apiShake = apiQC.preventShake(url, JSON.stringify(params));
  if (!apiShake) {
    // console.log('阻断本请求');
    return new Promise((resolve, reject) => {
      resolve({code: 201});
    });
  }
}

/*
 *  get请求
 *  url: 接口地址
 *  params: 参数，格式如下
 * */
export function get(url, params = {}, timeout = window.g.API_OUT_TIME) {
  // 根据请求url和参数，进行抖动熔断
  const shake = apiShakeCheck(url, params);
  if (shake) return shake;

  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'get',
      params: params,
      timeout, // 请求时间
    }).then((response) => {
      resolve(response);
    })['catch']((error) => {
      reject(error);
    });
  });
}

/*
 *  post请求
 *  url: 接口地址
 *  params: 参数，格式如下
 * */
export function post(url, params = {}, fd = false, timeout = window.g.API_OUT_TIME) {
  // 根据请求url和参数，进行抖动熔断
  const shake = apiShakeCheck(url, params);
  if (shake) return shake;

  let headers = {
    'Content-Type': 'application/json;charset=utf-8'
  };
  if (fd) {
    let formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }
    params = formData;
    headers = {
      'Content-Type': 'multipart/form-data'
    };
  }
  return new Promise((resolve, reject) => {
    httpService({
      headers: headers,
      url: url,
      method: 'post',
      data: params,
      timeout, // 请求时间
    }).then((response) => {
      resolve(response);
    })['catch']((error) => {
      reject(error);
    });
  });
}
/*
 *  putFormdata请求
 *  url: 接口地址
 *  params: 参数，格式如下
 * */
export function put(url, params = {}, fd = false, timeout = window.g.API_OUT_TIME) {
  // 根据请求url和参数，进行抖动熔断
  const shake = apiShakeCheck(url, params);
  if (shake) return shake;

  let headers = {
    'Content-Type': 'application/json;charset=utf-8'
  };
  if (fd) {
    let formData = new FormData();
    for (const key in params) {
      formData.append(key, params[key]);
    }
    params = formData;
    headers = {
      'Content-Type': 'multipart/form-data'
    };
  }
  return new Promise((resolve, reject) => {
    httpService({
      headers: headers,
      url: url,
      method: 'put',
      data: params,
      timeout, // 请求时间
    }).then((response) => {
      resolve(response);
    })['catch']((error) => {
      reject(error);
    });
  });
}

/*
 *  del请求
 *  url: 接口地址
 *  params: 参数，格式如下
 * */
export function del(url, params = {}, timeout = window.g.API_OUT_TIME) {
  // 根据请求url和参数，进行抖动熔断
  const shake = apiShakeCheck(url, params);
  if (shake) return shake;

  return new Promise((resolve, reject) => {
    httpService({
      url: url,
      method: 'delete',
      data: params,
      timeout, // 请求时间
    }).then((response) => {
      resolve(response);
    })['catch']((error) => {
      reject(error);
    });
  });
}

/*
 *  文件上传
 *  url:请求地址
 *  params:参数
 * */
export function upload(url, params = {}) {
  // 根据请求url和参数，进行抖动熔断
  const shake = apiShakeCheck(url, params);
  if (shake) return shake;
  
  var formData = new FormData();
  for (const key in params) {
    formData.append(key, params[key]);
  }

  return new Promise((resolve, reject) => {
    axios.create({
      withCredentials: false, // 允许携带cookie
      baseURL: BASEURL,
      timeout: 60000, // 请求超时时间
      // 修改请求头信息
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })({
      url: url,
      method: 'post',
      data: formData
    }).then((response) => {
      // console.log(response)
      resolve(response.data);
    })['catch']((error) => {
      store.commit('loadingStore', {
        tag: false,
        text: '加载中....'
      }); // 全局的数据 加载中.... - 开关
      store.commit('openSubmitDDTag', false); // 防抖动 - 开关
      ElMessage.error('文件上传请求超时，请稍候重试！');
      reject(error);
    });
  });
}

let downloadLoadingInstance;
// 通用下载方法
export function download(url, params, filename, timeout = window.g.API_OUT_TIME, config) {
  downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
  // 所有请求添加token字段
  const token = store.getters.token;
  let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  if (token !== null) {
    headers.Authorization = 'Bearer ' + token;
  }
  
  return httpService({
    transformRequest: [(params) => { return tansParams(params) }],
    headers,
    url: url,
    responseType: 'blob',
    data: params,
    method: 'post',
    timeout, // 请求时间
    ...config
  }).then(async (data) => {
    const isLogin = await blobValidate(data);
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      if (rspObj.code === 401) {
        ElMessage.info('您的访问权限已过期，请重新登录！');
        LJSsession.clearVuex(store);
        run.replace({
          path: '/login'
        });
      } else {
        ElMessage.error(rspObj.msg);
      }
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    ElMessage.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  });
}


export default {
  get,
  post,
  put,
  del,
  upload,
  download
};
