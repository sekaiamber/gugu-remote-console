import { encoder } from '../utils/object';

function factory(...args) {
  const ret = {
    log: args,
    caller: new Error().stack.split('\n')[3].trim(),
  };

  ret.log = ret.log.map((log) => {
    const str = JSON.stringify(encoder(log));
    return str;
  });

  return ret;
}

let syncRef;

export default class LogSender {
  constructor(rc) {
    this.remoteConsole = rc;
    this.sync = rc.sync;

    syncRef = this.sync.ref(`screens/${this.remoteConsole.uuid}`);
    const initData = {
      log: ['remote console connected!'],
      caller: '',
    };
    syncRef.remove(() => {
      syncRef.push(initData);
    });
  }

  send(...args) {
    const remoteLog = factory(...args);
    syncRef.push(remoteLog);
  }
}
