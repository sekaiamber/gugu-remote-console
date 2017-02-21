import RC from './rc';

export default function init(params) {
  // if no id, return.
  if (!params.uuid) return;

  const rLog = console.log;
  let rc;

  console.log = function log(...args) {
    rLog.apply(this, args);
    if (rc) {
      rc.submit(...args);
    } else if (window.wilddog) {
      rc = new RC(params.uuid);
      rc.submit(...args);
    }
  };
}

