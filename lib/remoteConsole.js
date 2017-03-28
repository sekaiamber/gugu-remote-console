import RC from './rc';

export default function init(params) {
  // if no id, return.
  if (!params.uuid) return;

  // ie8-9 console.xxx is an object
  if (Function.prototype.bind && window.console && typeof console.log === 'object') {
    ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'].forEach((method) => {
      console[method] = Function.prototype.call.bind(console[method], console);
    });
  }
  const rLog = console.log.bind(console);
  let rc;

  console.log = function log(...args) {
    rLog(...args);
    if (rc) {
      rc.submit(...args);
    } else if (window.wilddog) {
      rc = new RC(params.uuid);
      rc.submit(...args);
    }
  };
}

