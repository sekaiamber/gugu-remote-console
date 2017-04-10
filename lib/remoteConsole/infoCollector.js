import { CompareSender } from '../utils/object';

export default class InfoCollector {
  constructor(rc) {
    this.remoteConsole = rc;
    this.sync = rc.sync;

    this.location = new CompareSender(this.sendLocation.bind(this));
    this.locationSyncRef = null;
    this.userAgent = new CompareSender(this.sendUserAgent.bind(this));
    this.userAgentSyncRef = null;
    this.device = new CompareSender(this.sendDevice.bind(this));
    this.deviceSyncRef = null;

    this.init();
  }

  init() {
    // location and userAgent
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
