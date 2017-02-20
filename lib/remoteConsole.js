import RC from './rc';

const rLog = console.log;
let rc;

console.log = function log(...args) {
  rLog.apply(this, args);
  if (rc) {
    rc.submit(...args);
  } else if (window.wilddog) {
    rc = new RC(window.RC.uuid);
    rc.submit(...args);
  }
};
