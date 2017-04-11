import BaseModule from '../baseModule';
import { JSONEncoder } from '../../utils/object';

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

export default class LogSender extends BaseModule {
  init() {
    this.syncRef = this.sync.ref(`screens/${this.remoteConsole.uuid}`);
    const initData = {
      log: ['remote console connected!'],
      caller: '',
    };
    this.syncRef.remove(() => {
      this.syncRef.push(initData);
    });
    const self = this;
    console.log = function log(...args) {
      rLog(...args);
      self.send(...args);
    };
  }

  send(...args) {
    const remoteLog = factory(...args);
    this.syncRef.push(remoteLog);
  }
}
