let syncLogRef;
let syncCommandRef;
let syncNetworkResourcesRef;
let syncNetworkRequestsRef;
let syncInfoRef;

export default class RC {
  constructor(uuid, conf = {}) {
    this.wilddog = window.wilddog;
    this.uuid = uuid;

    if (conf.onLogAdd) this.onLogAdd = conf.onLogAdd;
    if (conf.onLogRemove) this.onLogRemove = conf.onLogRemove;
    if (conf.onCommandResponse) this.onCommandResponse = conf.onCommandResponse;
    if (conf.onNetworkResourcesChange) this.onNetworkResourcesChange = conf.onNetworkResourcesChange;
    if (conf.onNetworkRequestsChange) this.onNetworkRequestsChange = conf.onNetworkRequestsChange;
    if (conf.onInfoChange) this.onInfoChange = conf.onInfoChange;

    const config = {
      syncURL: 'https://remote-console.wilddogio.com/',
    };
    this.wilddog.initializeApp(config);
    this.sync = this.wilddog.sync();
    syncLogRef = this.sync.ref(`screens/${this.uuid}`);
    syncCommandRef = this.sync.ref(`commands/${this.uuid}`);
    syncNetworkResourcesRef = this.sync.ref(`networks/${this.uuid}/resources`);
    syncNetworkRequestsRef = this.sync.ref(`networks/${this.uuid}/requests`);
    syncInfoRef = this.sync.ref(`infos/${this.uuid}`);

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

    // network resources
    syncNetworkResourcesRef.on('value', (snapshot) => {
      const value = snapshot.val();
      if (value) {
        this.onNetworkResourcesChange(JSON.parse(value));
      } else {
        this.onNetworkResourcesChange([]);
      }
    });

    // network requests
    syncNetworkRequestsRef.on('value', (snapshot) => {
      const value = snapshot.val();
      if (value) {
        this.onNetworkRequestsChange(JSON.parse(value));
      } else {
        this.onNetworkRequestsChange([]);
      }
    });

    // info
    syncInfoRef.on('value', (snapshot) => {
      const info = snapshot.val();
      if (info) {
        Object.keys(info).forEach((key) => {
          info[key] = JSON.parse(info[key]);
        });
        this.onInfoChange(info);
      } else {
        this.onInfoChange({});
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

  onNetworkResourcesChange(/* resources */) {}

  onNetworkRequestsChange(/* requests */) {}

  onInfoChange(/* info */) {}

  disconnect() {
    this.wilddog.sync().goOffline();
  }
}
