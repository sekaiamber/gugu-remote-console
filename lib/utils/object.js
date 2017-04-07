import _ from 'lodash';

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

function JSONEncoder(obj, deep = 0, maxDeep = 5) {
  return JSON.stringify(obj, deep, maxDeep);
}

/**
 * 这个类型是用来包装任意数据，当数据相等时，不调用Send函数，节省带宽。可以设置interval，也是节省贷款
 */
class CompareSender {
  constructor(sendFn, initData, interval = 0) {
    this.data = initData;
    this.encodeData = JSONEncoder(initData);
    this.sender = sendFn;

    // interval
    this.interval = interval;
    this.lastChange = _.now();
    this.lastUpdate = 0;
  }

  set(data) {
    const now = _.now();
    this.lastChange = now;
    if (typeof data === 'object') {
      const encodeData = JSONEncoder(data);
      if (encodeData !== this.encodeData) {
        this.data = data;
        this.encodeData = encodeData;
        this.trySend(encodeData, data);
      }
    } else if (data !== this.data) {
      this.data = data;
      this.trySend(JSONEncoder(this.data), data);
    }
  }

  get() {
    return this.data;
  }

  trySend(encodeData, data) {
    const now = _.now();
    if (now - this.lastUpdate >= this.interval) {
      this.lastUpdate = now;
      this.sender(encodeData, data);
    } else if (this.lastChange >= this.lastUpdate) {
      setTimeout(this.trySend.bind(this, encodeData, data), this.interval);
    }
  }
}

export {
  encoder,
  JSONEncoder,
  CompareSender,
};
