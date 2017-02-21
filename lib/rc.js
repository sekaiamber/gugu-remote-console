function UUID() {
  const now = new Date();
  return `${now.getTime()}_${window.location.host}`;
}

let syncRef;

export default class rc {
  constructor(uuid) {
    this.wilddog = window.wilddog;
    this.uuid = uuid || UUID();
    const config = {
      syncURL: 'https://remote-console.wilddogio.com/',
    };
    this.wilddog.initializeApp(config);
    syncRef = this.wilddog.sync().ref(`screens/${this.uuid}`);
    const initData = {
      log: ['remote console connected!'],
      caller: '',
    };
    syncRef.remove(() => {
      syncRef.push(initData);
    });
  }

  _factory(...args) {
    const ret = {
      log: args,
      caller: new Error().stack.split('\n')[3].trim(),
    };

    ret.log = ret.log.map((log) => {
      const str = log.toString();
      return str;
    });

    return ret;
  }

  submit(...args) {
    const remoteLog = this._factory(...args);
    syncRef.push(remoteLog);
  }
}
