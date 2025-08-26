import LJSbase from './utils/base'
import LJSdate from './utils/date'
import LJSnum from './utils/num'
import LJSfc from './utils/formCheck'
import LJSmsg from './utils/msg'
import LJSrun, { setBeforeEachTag } from './utils/run'
import LJSanimation from './utils/animation'
import LJSurl from './utils/url'
import LJSprivacy from './utils/privacy'

// function：工具方法
// directive：指令
// component：组件
// 工具
const tools = [
  { type: 'function', name: 'base', entity: LJSbase },
  { type: 'function', name: 'date', entity: LJSdate },
  { type: 'function', name: 'num', entity: LJSnum },
  { type: 'function', name: 'fc', entity: LJSfc },
  { type: 'function', name: 'msg', entity: LJSmsg },
  { type: 'function', name: 'run', entity: LJSrun },
  { type: 'function', name: 'animation', entity: LJSanimation },
  { type: 'function', name: 'url', entity: LJSurl },
  { type: 'function', name: 'privacy', entity: LJSprivacy },
]

/* 
  定义install 方法，接收Vue作为参数，如果使用use注册插件，则所有的组件都将被注册
*/
const globals = {
  // 全局注入
  install: function (app, options) {
    if (!LJSbase.fieldCheck(options)) {
      // 设置路由守卫的开关
      if (!LJSbase.fieldCheck(options.beforeEachTag)) {
        setBeforeEachTag(options.beforeEachTag)
      }
    }

    tools.map((funs) => {
      // console.log(funs.name);
      if (funs.type === 'directive') {
        app.use(funs.entity)
      } else if (funs.type === 'component') {
        app.component(`${funs.name}`, funs.entity)
      } else if (funs.type === 'other_function') {
        for (let key in funs.entity) {
          app.config.globalProperties[key] = funs.entity[key]
        }
      } else {
        const newKey = `$LJS${funs.name}`
        app.config.globalProperties[newKey] = funs.entity
      }
    })
  },
}

export default globals
export {
	// 局部引入时使用
	// 方法
	LJSbase,
	LJSdate,
	LJSnum,
	LJSfc,
	LJSmsg,
	LJSrun,
	LJSanimation,
	LJSprivacy,
}
