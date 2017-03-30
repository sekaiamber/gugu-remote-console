let syncLogRef;
let syncCommandRef;

export default class RC {
  constructor(uuid, conf = {}) {
    this.wilddog = window.wilddog;
    this.uuid = uuid;

    if (conf.onLogAdd) this.onLogAdd = conf.onLogAdd;
    if (conf.onLogRemove) this.onLogRemove = conf.onLogRemove;
    if (conf.onCommandResponse) this.onCommandResponse = conf.onCommandResponse;

    const config = {
      syncURL: 'https://remote-console.wilddogio.com/',
    };
    this.wilddog.initializeApp(config);
    this.sync = this.wilddog.sync();
    syncLogRef = this.sync.ref(`screens/${this.uuid}`);
    syncCommandRef = this.sync.ref(`commands/${this.uuid}`);

    // logs
    syncLogRef.endAt(0).limitToLast(10).on('child_added', (snapshot) => {
      const val = snapshot.val();
      this.onLogAdd(val.log, val.caller, snapshot.key());
    });

    syncLogRef.on('child_removed', (snapshot) => {
      this.onLogRemove(snapshot.key());
    });

    // commands
    syncCommandRef.child('response').on('value', (snapshot) => {
      const response = snapshot.val();
      if (response) {
        this.onCommandResponse(response);
      }
    });
  }

  onLogAdd(members /* , caller, key */) {
    console.log(...members);
  }

  onLogRemove(/* key */) {}

  sendCommand(command) {
    const request = {
      data: command,
      id: new Date().getTime() + '_' + parseInt(Math.random() * 100, 10),
    };
    syncCommandRef.update({
      command: request,
    });
  }

  onCommandResponse(/* response */) {}

  disconnect() {
    this.wilddog.sync().goOffline();
  }
}
