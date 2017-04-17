// 这个修饰器提供更加简单的连接Store的方式，当然也可以手动连接
// store需要Module设置.storeKeys的参数来限定写入
// 并且提供.store.registerWriter的参数来注册写入器

export default function connectStore(conf = {}) {
  return function wrapper(Module) {
    return class WrapperModule extends Module {
      connectStore() {
        // name
        this.moduleName = Module.name;
        // writer
        const writers = conf.writers;
        if (writers) {
          this.storeKeys = Object.keys(writers);
          this.storeKeys.forEach((key) => {
            const writer = writers[key];
            this.store.registerWriter(key, writer.initData, writer);
          });
        }
        // config
        const configs = conf.config;
        if (configs) {
          this.configKeys = Object.keys(configs);
          this.configKeys.forEach((key) => {
            const config = configs[key];
            this.config[key] = config.initData;
            this.configurator.registerConfig(this.moduleName, key, config, (newValue) => {
              this.config[key] = newValue;
            });
          });
        }
      }
    };
  };
}
