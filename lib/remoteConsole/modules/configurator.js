import BaseModule from '../baseModule';
import connectStore from '../connectStore';

const storeConfig = {
  writers: {
    configs: { interval: 1000, encode: false },
  },
};

@connectStore(storeConfig)
export default class Configurator extends BaseModule {
  init() {
    this.short = {};
    this.onceDataChange('configs', (configs) => {
      if (configs) {
        // 存在配置
        Object.keys(configs).forEach((key) => {
          if (this.short[key]) {
            if (this.short[key].value !== configs[key]) {
              this.short[key].onChange(configs[key]);
              this.short[key].value = configs[key];
            }
          }
        });
      }
      // 不存在配置，或设置配置以后，复写
      const newConfigs = {};
      Object.keys(this.short).forEach((key) => {
        newConfigs[key] = this.short[key].value;
      });
      this.setData('configs', newConfigs);
    });
    this.store.onChildChange('configs', (value, path) => {
      if (this.short[path]) {
        this.short[path].onChange(value);
      }
    });
  }
  registerConfig(namespace, key, config, onChange) {
    const short = config.short ? config.short : key;
    this.short[short] = {
      namespace,
      name: key,
      value: config.initData,
      onChange,
    };
  }
}
