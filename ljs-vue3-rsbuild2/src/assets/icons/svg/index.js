// 把当前文件夹下所有svg全部导入
const svgFiles = import.meta.glob('./*.svg', { eager: true });
Object.keys(svgFiles).forEach((key) => svgFiles[key]);