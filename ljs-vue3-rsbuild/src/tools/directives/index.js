// 引入指令
import hasPermi from './module/hasPermi.js';
import hasRole from './module/hasRole.js';

const powerDirectives = [
  hasPermi,
  hasRole,
];

const globals = {
  install: function (app) {
    powerDirectives.map(powerDirective => {
      Object.keys(powerDirective).forEach(key => {
        app.directive(key, powerDirective[key]);
      });
    })
  }
};

export default globals;
