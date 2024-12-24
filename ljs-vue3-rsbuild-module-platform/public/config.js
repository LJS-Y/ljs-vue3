/**
 * 公共配置
 * 可在打包后的文件中直接修改。
 *  */
window.g = {
  API_OUT_TIME: 60000, // 请求超时时间
  grayStyle: false, // 灰色模式，默认不开启
  // 驾驶舱公共配置
  cockpit: {
    lhbz: ['LHBZ-001', 'LHBZ-002', 'LHBZ-003', 'LHBZ-004'], // 绿化泵站 - 模型上的4个泵绑定的设备编码
    jybz: ['JYBZ-001', 'JYBZ-002', 'JYBZ-003', 'JYBZ-004', 'JYBZ-005'], // 加压泵站 - 模型上的5个泵绑定的设备编码
  },
}
