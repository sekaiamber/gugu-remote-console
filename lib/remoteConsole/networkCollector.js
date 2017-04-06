import { getUrlFilename } from '../utils';
import { CompareSender } from '../utils/object';

const performance = window.webkitPerformance || window.performance;
const hasResourceTiming = performance && typeof performance.getEntries === 'function';

function formatTime(time) {
  const _time = Math.round(time);
  if (_time < 1000) return _time + 'ms';
  return (_time / 1000).toFixed(1) + 's';
}

export default class NetworkCollector {
  constructor(rc) {
    this.remoteConsole = rc;
    this.sync = rc.sync;

    this.resources = new CompareSender(this.sendResources.bind(this));
    this.resourcesSyncRef = null;
    this.requests = new CompareSender(this.sendResources.bind(this));
    this.init();

    // update
    setInterval(this.update.bind(this), 1000);
  }

  init() {
    // resources
    this.resourcesSyncRef = this.sync.ref(`networks/${this.remoteConsole.uuid}/resources`);
    this.resourcesSyncRef.remove();
    if (hasResourceTiming) {
      this.updateResources();
    }
  }

  updateResources() {
    if (hasResourceTiming) {
      const entries = performance.getEntries();
      const data = [];
      entries.forEach((entry) => {
        // 隐藏xhr资源请求
        if (entry.initiatorType === 'xmlhttprequest') return;

        data.push({
          name: getUrlFilename(entry.name),
          displayTime: formatTime(entry.duration),
          url: entry.name,
          initiatorType: entry.initiatorType,
        });
      });

      this.resources.set(data);
    }
  }

  update() {
    this.updateResources();
  }

  sendResources(encodeData) {
    this.resourcesSyncRef.set(encodeData);
  }
}
