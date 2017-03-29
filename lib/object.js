function stringEncoder(str, maxLength = 50) {
  if (str.length > maxLength) {
    const halfMaxLength = (maxLength - 3) / 2;
    return str.slice(0, halfMaxLength) + '...' + str.slice(-halfMaxLength);
  }
  return str;
}

/**
 * 包装器，这个包装器拥有如下功能
 *   - 基础类型全部返回
 *   - string过长切割
 *   - object deep copy
 *   - object层级深度过深切断
 */
function encoder(obj, deep = 0, maxDeep = 5) {
  let ret;
  const type = typeof obj;
  if (
    obj === null ||
    type === 'boolean' ||
    type === 'number'
  ) {
    ret = obj;
  } else if (type === 'string') {
    ret = stringEncoder(obj);
  } else if (type === 'function') {
    ret = '[Function]';
  } else if (type === 'object') {
    ret = {};
    if (deep === maxDeep) return '[Object]';
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        ret[key] = encoder(obj[key], deep + 1);
      }
    }
  } else {
    ret = '[Unknown content]';
  }
  return ret;
}

export {
  encoder,
};
