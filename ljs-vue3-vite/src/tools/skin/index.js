import def from './modules/default.js';
import black from './modules/black.js';
import green from './modules/green.js';
export default (theme) => {
  switch (theme) {
    case 'default':
      return def;
    case 'black':
      return black;
    case 'green':
      return green;
  }
  return def;
};
