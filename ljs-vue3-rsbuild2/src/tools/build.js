export function numberB0(n, num = 2, fillStr = '0') {
  n = n.toString();
  const wNum = n.length;
  const zeroNum = num - wNum;
  let zero = '';
  for (let i = 0; i < zeroNum; i++) {
    zero += fillStr;
  }
  return zero + n;
}
export function getBuildTime(time = new Date(), pattern) {
  const date = new Date(time);
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
  const formatObj = {
    y: date.getFullYear(),
    m: numberB0(date.getMonth() + 1),
    d: numberB0(date.getDate()),
    h: numberB0(date.getHours()),
    i: numberB0(date.getMinutes()),
    s: numberB0(date.getSeconds()),
    MS: date.getMilliseconds()
  };
  return format.replace(/{(y|m|d|h|i|s|MS)+}/g, (result, key) => {
    const value = formatObj[key];
    return value;
  });
};

