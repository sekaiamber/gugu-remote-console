import BaseModule from '../baseModule';
import connectStore from '../connectStore';

const storeConfig = {
  writers: {
    info_location: { clean: true },
    info_userAgent: { clean: true },
    info_device: { clean: true },
  },
  config: {
    enable: { initData: true, short: 'Ie' },
  },
};

@connectStore(storeConfig)
export default class InfoCollector extends BaseModule {
  init() {
    // config
    this.updateInterval = 1000;
  }

  update() {
    this.setData('info_location', window.location.href);
    this.setData('info_userAgent', window.navigator.userAgent);
    this.setData('info_device', {
      screen: `${screen.width} * ${screen.height}`,
      viewport: `${window.innerWidth} * ${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio,
    });
  }
}
