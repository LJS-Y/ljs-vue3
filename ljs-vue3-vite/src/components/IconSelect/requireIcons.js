// const req = require.context('../../assets/icons/svg', false, /\.svg$/)
const req = import.meta.glob('../../assets/icons/svg/**/*.svg');
const requireAll = requireContext => {
  const list = [];
  Object.keys(requireContext).forEach((key) => {
    const fileNames = key.split('/');
    const fileName = fileNames[fileNames.length - 1];
    const keys = fileName.split('.');
    list.push(keys[0]);
  });
  return list;
}

const re = /\.\/(.*)\.svg/

const icons = requireAll(req)

export default icons
