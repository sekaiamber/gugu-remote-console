import _ from 'lodash';
import { getUrlFilename } from '../utils';
import { CompareSender } from '../utils/object';
import Request from '../utils/request';

const performance = window.webkitPerformance || window.performance;
const winXhrProto = window.XMLHttpRequest.prototype;
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
    this.requests = new CompareSender(this.sendXHRRequests.bind(this), {}, 1000);
    this.requestsSyncRef = null;
    this.requestsLastUpdate = _.now();
    this.init();

    // xhr requset
    this.xhrOrigSend = null;
    this.xhrOrigOpen = null;

    // update
    setInterval(this.update.bind(this), 1000);
  }

  init() {
    const self = this;

    // resources
    this.resourcesSyncRef = this.sync.ref(`networks/${this.remoteConsole.uuid}/resources`);
    this.resourcesSyncRef.remove();
    if (hasResourceTiming) {
      this.updateResources();
    }

    // xhr request
    this.requestsSyncRef = this.sync.ref(`networks/${this.remoteConsole.uuid}/requests`);
    this.requestsSyncRef.remove();
    const xhrOrigSend = this.xhrOrigSend = winXhrProto.send;
    const xhrOrigOpen = this.xhrOrigOpen = winXhrProto.open;
    winXhrProto.open = function open(method, url) {
      const xhr = this;

      const req = xhr.guguRequest = new Request(xhr, method, url);

      req.on('send', (id, data) => self._addReq(id, data));
      req.on('update', (id, data) => self._updateReq(id, data));

      xhr.addEventListener('readystatechange', () => {
        switch (xhr.readyState) {
          case 2: return req.handleHeadersReceived();
          case 4: return req.handleDone();
          default: break;
        }
        return undefined;
      });

      /* eslint-disable */
      xhrOrigOpen.apply(this, arguments);
      /* eslint-enable */
    };

    winXhrProto.send = function send(data) {
      const req = this.guguRequest;
      if (req) req.handleSend(data);

      /* eslint-disable */
      xhrOrigSend.apply(this, arguments);
      /* eslint-enable */
    };
  }

  _addReq(id, data) {
    _.defaults(data, {
      name: '',
      url: '',
      status: 'pending',
      type: 'unknown',
      subType: 'unknown',
      size: 0,
      data: '',
      method: 'GET',
      startTime: _.now(),
      time: 0,
      resHeaders: {},
      resTxt: '',
      done: false,
    });

    const requests = this.requests.get();
    requests[id] = data;
    this.requests.set(requests);
  }
  _updateReq(id, data) {
    const requests = this.requests.get();
    const target = requests[id];

    if (!target) return;

    _.extend(target, data);

    target.time -= target.startTime;
    target.displayTime = formatTime(target.time);

    if (target.done && (target.status < 200 || target >= 300)) target.hasErr = true;
    this.requests.set(requests);
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

  sendXHRRequests(encodeData, data) {
    const _data = Object.keys(data).map(key => data[key]);
    _data.sort((a, b) => a.startTime - b.startTime);
    this.requestsSyncRef.set(JSON.stringify(_data));
  }
}
