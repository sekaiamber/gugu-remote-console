import { JSONEncoder } from 'gugu-remote-utils';
import BaseModule from '../baseModule';
import connectStore from '../connectStore';

// ie8-9 console.xxx is an object
if (Function.prototype.bind && window.console && typeof console.log === 'object') {
  ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'].forEach((method) => {
    console[method] = Function.prototype.call.bind(console[method], console);
  });
}
const rLog = console.log.bind(console);

function factory(...args) {
  const ret = {
    log: args,
    caller: new Error().stack.split('\n')[3].trim(),
  };

  ret.log = ret.log.map((log) => {
    const str = JSONEncoder(log);
    return str;
  });

  return ret;
}

const storeConfig = {
  writers: {
    logs: {
      initData: {
        log: ['remote console connected!'],
        caller: '',
      },
      clean: true,
      compare: false,
      encode: false,
      beforeSend: data => data,
    },
  },
  config: {
    enable: { initData: true, short: 'Le' },
  },
};

@connectStore(storeConfig)
export default class LogSender extends BaseModule {
  init() {
    const self = this;
    console.log = function log(...args) {
      rLog(...args);
      const remoteLog = factory(...args);
      self.setData('logs', remoteLog);
    };
  }
}
