import BaseModule from '../baseModule';
import { CompareSender } from '../../utils/object';

export default class InfoCollector extends BaseModule {
  init() {
    this.location = new CompareSender(this.sendLocation.bind(this));
    this.userAgent = new CompareSender(this.sendUserAgent.bind(this));
    this.device = new CompareSender(this.sendDevice.bind(this));
    this.locationSyncRef = this.sync.ref(`infos/${this.remoteConsole.uuid}/location`);
    this.userAgentSyncRef = this.sync.ref(`infos/${this.remoteConsole.uuid}/userAgent`);
    this.deviceSyncRef = this.sync.ref(`infos/${this.remoteConsole.uuid}/device`);

    setInterval(() => {
      this.location.set(window.location.href);
      this.userAgent.set(window.navigator.userAgent);
      this.device.set({
        screen: `${screen.width} * ${screen.height}`,
        viewport: `${window.innerWidth} * ${window.innerHeight}`,
        pixelRatio: window.devicePixelRatio,
      });
    }, 1000);
  }

  sendLocation(encodeData) {
    this.locationSyncRef.set(encodeData);
  }

  sendUserAgent(encodeData) {
    this.userAgentSyncRef.set(encodeData);
  }

  sendDevice(encodeData) {
    this.deviceSyncRef.set(encodeData);
  }
}
