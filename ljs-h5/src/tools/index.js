// 基础库
import apiQC from '@/tools/apiQueryChange.js';
import base from '@/tools/base.js';
import run from '@/tools/run.js';
import msg from '@/tools/msg.js';
import dict from '@/tools/dict/index.js';
import em from '@/tools/errorImages.js';
import comB from '@/assets/js/base.js'; // 公共js（每个项目不一样）
// 指令
import directives from '@/tools/directives/index.js';

// 独立挂载
import { download } from '@/api/axios.js';
const self = {
  download: download, // API挂载方法
};

// ruoyi
import { resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from '@/tools/ruoyi/ruoyi.js';
import { checkPermi, checkRole } from '@/tools/ruoyi/permission.js';
const ruoyi = {
  // 全局方法挂载 - ruoyi
  resetForm: resetForm,
  addDateRange: addDateRange,
  selectDictLabel: selectDictLabel,
  selectDictLabels: selectDictLabels,
  handleTree: handleTree,
  checkPermi: checkPermi,
  checkRole: checkRole,
};

// function：工具方法
// directive：指令
// component：组件
// 工具
const tools = [
  {type: 'function', name: 'apiQC', entity: apiQC},
  {type: 'function', name: 'base', entity: base},
  {type: 'function', name: 'run', entity: run},
  {type: 'function', name: 'msg', entity: msg},
  {type: 'function', name: 'dict', entity: dict},
  {type: 'function', name: 'comB', entity: comB},
  {type: 'function', name: 'em', entity: em},
  
  {type: 'directive', name: 'directives', entity: directives},

  {type: 'other_function', name: 'self', entity: self},
  {type: 'other_function', name: 'ruoyi', entity: ruoyi},
]

/* 
  定义install 方法，接收Vue作为参数，如果使用use注册插件，则所有的组件都将被注册
*/
const globals = {
  install: function (app) {
    tools.map(funs => {
      // console.log(funs.name);
      if (funs.type === 'directive') {
        app.use(funs.entity);
      } else if (funs.type === 'component') {
        app.component(`${funs.name}`, funs.entity);
      } else if (funs.type === 'other_function') {
        for (let key in funs.entity) {
          app.config.globalProperties[key] = funs.entity[key];
        }
      } else {
        const newKey = `$${funs.name}`;
        app.config.globalProperties[newKey] = funs.entity;
      }
    })
  }
};

export default globals;