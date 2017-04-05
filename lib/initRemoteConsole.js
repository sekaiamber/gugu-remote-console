import RC from './remoteConsole';

let rc;

export default function initRemoteConsole(params) {
  // if no id, return.
  if (!params.uuid) return;

  function getRc() {
    if (window.wilddog) {
      rc = new RC(params.uuid);
    } else {
      setTimeout(getRc, 100);
    }
  }
  getRc();

  window.__rc__ = rc;
}

