function UUID() {
  const now = new Date();
  return `${now.getTime()}_${window.location.host}`;
}

export default class rc {
  constructor(uuid) {
    this.wilddog = window.wilddog;
    this.uuid = uuid || UUID();
    const config = {
      syncURL: 'https://remote-console.wilddogio.com/',
    };
    this.wilddog.initializeApp(config);
    this.syncRef = this.wilddog.sync().ref(`screens/${this.uuid}`);
    const initData = {
      log: 'remote console connected!',
      caller: '',
    };
    this.syncRef.push(initData);
  }

  submit(...args) {
    console.info(this.uuid);
    const stack = new Error().stack.split('\n')[3];
    console.info(stack);
  }
}
