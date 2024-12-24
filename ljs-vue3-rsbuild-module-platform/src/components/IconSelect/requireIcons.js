// const req = require.context('../../assets/icons/svg', false, /\.svg$/)
const req = import.meta.webpackContext('../../assets/icons/svg', {
  // 是否搜索子目录
  recursive: true,
  regExp: /\.svg$/,
});

const icons = [];
for (const path of req.keys()) {
  const fileNames = path.split('/');
  const fileName = fileNames[fileNames.length - 1];
  const keys = fileName.split('.');
  icons.push(keys[0]);
}

export default icons
