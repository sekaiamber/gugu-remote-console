import { CompareSender } from 'gugu-remote-utils';
import getConfig from './wilddogconfig';

export default class Store {
  constructor(uuid) {
    this.wilddog = window.wilddog;
    const config = {
      syncURL: 'https://remote-console.wilddogio.com/',
    };

    this.connects = getConfig(uuid);
    this.wilddog.initializeApp(config);
    this.sync = this.wilddog.sync();

    this.data = {};
  }
  get(key) {
    return this.data[key].get();
  }

  // writer
  registerWriter(key, initData, conf = {}) {
    const connect = this.connects[key];
    if (!connect) return;
    connect.syncRef = connect.syncRef || this.sync.ref(connect.path);
    if (conf.clean) {
      connect.syncRef.remove();
    }
    this.data[key] = new CompareSender(this._sendFn.bind(this, key), initData, conf);
  }
  _sendFn(key, data) {
    const connect = this.connects[key];
    connect.syncRef[connect.setDataMethod](data);
  }
  set(key, data, dontSend) {
    this.data[key].set(data, dontSend);
  }

  // listener
  addListener(key, method, callback) {
    const connect = this.connects[key];
    if (!connect) return;
    connect.syncRef = connect.syncRef || this.sync.ref(connect.path);
    connect.syncRef.on(method, (snapshot) => {
      callback(snapshot.val(), snapshot.key());
    });
  }
  addOnceListener(key, method, callback) {
    const connect = this.connects[key];
    if (!connect) return;
    connect.syncRef = connect.syncRef || this.sync.ref(connect.path);
    connect.syncRef.once(method, (snapshot) => {
      callback(snapshot.val());
    });
  }
  onChange(key, callback) {
    this.addListener(key, 'value', callback);
  }
  onceChange(key, callback) {
    this.addOnceListener(key, 'value', callback);
  }
  onChildChange(key, callback) {
    this.addListener(key, 'child_changed', callback);
  }

}
