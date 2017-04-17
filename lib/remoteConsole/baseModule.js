export default class BaseModule {
  inited = false

  constructor(rc) {
    this.remoteConsole = rc;
    this.store = rc.store;
    this.configurator = rc.configurator;
    this.config = {
      enable: true,
    };
    // store
    this.connectStore();
    // init
    this.init();
    this.inited = true;

    // update
    if (this.update) {
      if (this.updateInterval > 0) {
        const loop = () => {
          if (this.config.enable) {
            this.update();
          }
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
  setData(key, value, dontSend) {
    if (this.config.enable && this.storeKeys.indexOf(key) > -1) {
      this.store.set(key, value, dontSend);
    }
  }
  // listener
  // 可监听任意key上的事件
  onDataChange(key, callback) {
    this.store.onChange(key, callback);
  }
  onceDataChange(key, callback) {
    this.store.onceChange(key, callback);
  }

}
