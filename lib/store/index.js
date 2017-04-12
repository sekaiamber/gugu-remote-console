import { CompareSender } from '../utils/object';
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
    this.data[key] = new CompareSender(this.sendFn.bind(this, key), initData, conf);
  }
  sendFn(key, data) {
    const connect = this.connects[key];
    connect.syncRef[connect.setDataMethod](data);
  }
  set(key, data) {
    this.data[key].set(data);
  }

  // listener
  addListener(key, method, callback) {
    const connect = this.connects[key];
    if (!connect) return;
    connect.syncRef = connect.syncRef || this.sync.ref(connect.path);
    connect.syncRef.on(method, (snapshot) => {
      callback(snapshot.val());
    });
  }
  onChange(key, callback) {
    this.addListener(key, 'value', callback);
  }

}
