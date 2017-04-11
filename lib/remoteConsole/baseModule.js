export default class BaseModule {
  inited = false

  constructor(rc) {
    this.remoteConsole = rc;
    this.sync = rc.sync;

    this.init();
    this.inited = true;
  }

  init() {}
  update() {}
}
