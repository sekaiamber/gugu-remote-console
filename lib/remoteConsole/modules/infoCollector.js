import BaseModule from '../baseModule';

export default class InfoCollector extends BaseModule {
  init() {
    // config
    this.updateInterval = 1000;
    // store
    this.storeKeys = ['info_location', 'info_userAgent', 'info_device'];
    this.store.registerWriter('info_location', undefined, {
      clean: true,
    });
    this.store.registerWriter('info_userAgent', undefined, {
      clean: true,
    });
    this.store.registerWriter('info_device', undefined, {
      clean: true,
    });
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
