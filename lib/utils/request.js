import Emitter from 'event-emitter';
import { _ } from 'gugu-remote-utils';
import { getUrlFilename } from './index';

const origin = window.location.origin;

function fullUrl(url) {
  if (_.startsWith(url, 'http')) return url;
  let _url = url;
  if (!_.startsWith(url, '/')) _url = '/' + url;
  return origin + _url;
}

function getHeaders(xhr) {
  const raw = xhr.getAllResponseHeaders();
  const lines = raw.split('\n');

  const ret = {};

  _.each(lines, (line) => {
    const _line = _.trim(line);
    if (_line === '') return;
    const [key, val] = _line.split(':', 2);
    ret[key] = _.trim(val);
  });

  return ret;
}

function getType(contentType) {
  if (!contentType) return 'unknown';

  const type = contentType.split(';')[0].split('/');

  return {
    type: type[0],
    subType: _.last(type),
  };
}

function lenToUtf8Bytes(str) {
  const m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

function isCrossOrig(url) {
  return !_.startsWith(url, origin);
}

function getSize(xhr, headersOnly, url) {
  let size = 0;
  function getStrSize() {
    if (!headersOnly) {
      const resType = xhr.responseType;
      if (resType === '' || resType === 'text') {
        const resTxt = xhr.responseText;
        if (resTxt) size = lenToUtf8Bytes(resTxt);
      }
      if (resType === 'arraybuffer') size = xhr.response.byteLength;
      if (resType === 'blob') size = xhr.response.size;
    }
  }

  if (isCrossOrig(url)) {
    getStrSize();
  } else {
    try {
      size = _.toNumber(xhr.getResponseHeader('Content-Length'));
    } catch (e) {
      getStrSize();
    }
  }

  if (size === 0) getStrSize();

  if (size < 1024) return size + 'B';

  return (size / 1024).toFixed(1) + 'KB';
}

export default class Request {
  constructor(xhr, method, url) {
    this._xhr = xhr;
    this._method = method;
    this._url = fullUrl(url);
    this._id = _.uniqueId('request');
  }

  handleSend(data) {
    let _data = data;
    if (!_.isString(data)) _data = '';

    this.emit('send', this._id, {
      name: getUrlFilename(this._url),
      url: this._url,
      data: _data,
      method: this._method,
    });
  }

  handleHeadersReceived() {
    const xhr = this._xhr;
    const type = getType(xhr.getResponseHeader('Content-Type'));

    this.emit('update', this._id, {
      type: type.type,
      subType: type.subType,
      size: getSize(xhr, true, this._url),
      time: _.now(),
      resHeaders: getHeaders(xhr),
    });
  }

  handleDone() {
    const xhr = this._xhr;
    const resType = xhr.responseType;

    const resTxt = (resType === '' || resType === 'text') ? xhr.responseText : '';

    this.emit('update', this._id, {
      status: xhr.status,
      done: true,
      size: getSize(xhr, false, this._url),
      time: _.now(),
      resTxt,
    });
  }
}

Emitter(Request.prototype);
