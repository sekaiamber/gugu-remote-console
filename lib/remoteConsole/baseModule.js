export default class BaseModule {
  inited = false

  constructor(rc) {
    this.remoteConsole = rc;
    this.store = rc.store;
    // store
    this.connectStore();
    // init
    this.init();
    this.inited = true;

    // update
    if (this.update) {
      if (this.updateInterval > 0) {
        const loop = () => {
          this.update();
          setTimeout(loop, this.updateInterval);
        };
        loop();
      }
      this.update();
    }
  }

  init() {}
  // update() {}

  // store
  connectStore() {}
  // 可读取整个store任意key上的内容
  getData(key) {
    return this.store.get(key);
  }
  // writer
  // 只能设置自己注册的key的内容
  setData(key, value) {
    if (this.storeKeys.indexOf(key) > -1) {
      this.store.set(key, value);
    }
  }
  // listener
  // 可监听任意key上的事件
  onDataChange(key, callback) {
    this.store.onChange(key, callback);
  }

}
