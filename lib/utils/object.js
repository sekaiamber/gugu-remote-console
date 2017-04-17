import * as _ from './lodash';

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
  constructor(sendFn, initData, conf = {}) {
    _.defaults(conf, {
      interval: 0,
      compare: true,
      encode: true,
      beforeSend: (data, encodeData) => (this.encode ? encodeData : data),
    });
    this.data = initData;
    this.encodeData = JSONEncoder(initData);
    this.sender = sendFn;

    // interval
    this.interval = conf.interval;
    this.beforeSend = conf.beforeSend;
    this.lastChange = _.now();
    this.lastUpdate = 0;

    // initData
    if (initData) {
      this.trySend(this.data, this.encodeData);
    }

    // compare
    this.compare = conf.compare;
    this.encode = conf.encode;
  }

  set(data, dontSend) {
    const now = _.now();
    this.lastChange = now;
    if (this.compare) {
      if (typeof data === 'object') {
        const encodeData = JSONEncoder(data);
        if (encodeData !== this.encodeData) {
          this.data = data;
          this.encodeData = encodeData;
          if (!dontSend) this.trySend(data, this.encode ? encodeData : null);
        }
      } else if (data !== this.data) {
        this.data = data;
        if (!dontSend) this.trySend(data, this.encode ? JSONEncoder(this.data) : null);
      }
    } else {
      this.data = data;
      if (!dontSend) this.trySend(data, this.encode ? JSONEncoder(this.data) : null);
    }
  }

  get() {
    return this.data;
  }

  trySend(data, encodeData) {
    const now = _.now();
    if (now - this.lastUpdate >= this.interval) {
      this.lastUpdate = now;
      const sendData = this.beforeSend(data, encodeData);
      this.sender(sendData);
    } else if (this.lastChange >= this.lastUpdate) {
      setTimeout(this.trySend.bind(this, data, encodeData), this.interval);
    }
  }
}

export {
  encoder,
  JSONEncoder,
  CompareSender,
};
