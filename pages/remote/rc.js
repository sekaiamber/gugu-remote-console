let syncRef;

export default class RC {
  constructor(uuid, conf = {}) {
    this.wilddog = window.wilddog;
    this.uuid = uuid;

    if (conf.onAdd) this.onAdd = conf.onAdd;
    if (conf.onRemove) this.onRemove = conf.onRemove;

    const config = {
      syncURL: 'https://remote-console.wilddogio.com/',
    };
    this.wilddog.initializeApp(config);
    syncRef = this.wilddog.sync().ref(`screens/${this.uuid}`);

    syncRef.endAt(0).limitToLast(10).on('child_added', (snapshot) => {
      const val = snapshot.val();
      this.onAdd(val.log, val.caller, snapshot.key());
    });

    syncRef.on('child_removed', (snapshot) => {
      this.onRemove(snapshot.key());
    });
  }

  onAdd(members /* , caller, key */) {
    console.log(...members);
  }

  onRemove(/* key */) {}

  disconnect() {
    this.wilddog.sync().goOffline();
  }
}
