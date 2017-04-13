import BaseModule from '../baseModule';
import * as _ from '../../utils/lodash';
import { getUrlFilename } from '../../utils';
import Request from '../../utils/request';

const performance = window.webkitPerformance || window.performance;
const winXhrProto = window.XMLHttpRequest.prototype;
const hasResourceTiming = performance && typeof performance.getEntries === 'function';

function formatTime(time) {
  const _time = Math.round(time);
  if (_time < 1000) return _time + 'ms';
  return (_time / 1000).toFixed(1) + 's';
}

export default class NetworkCollector extends BaseModule {

  init() {
    const self = this;
    // config
    this.updateInterval = 1000;
    // store
    this.storeKeys = ['networks_resources', 'network_requests'];
    this.store.registerWriter('networks_resources', undefined, {
      clean: true,
    });
    this.store.registerWriter('network_requests', {}, {
      clean: true,
      interval: 1000,
      beforeSend: (data) => {
        const _data = Object.keys(data).map(key => data[key]);
        _data.sort((a, b) => a.startTime - b.startTime);
        return JSON.stringify(_data);
      },
    });

    // xhr request
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

    const requests = this.getData('network_requests');
    requests[id] = data;
    this.setData('network_requests', requests);
  }
  _updateReq(id, data) {
    const requests = this.getData('network_requests');
    const target = requests[id];

    if (!target) return;

    _.extend(target, data);

    target.time -= target.startTime;
    target.displayTime = formatTime(target.time);

    if (target.done && (target.status < 200 || target >= 300)) target.hasErr = true;
    this.setData('network_requests', requests);
  }

  update() {
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

      this.setData('networks_resources', data);
    }
  }
}
