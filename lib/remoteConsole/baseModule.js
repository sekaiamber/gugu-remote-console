export default class BaseModule {
  inited = false

  constructor(rc) {
    this.remoteConsole = rc;
    this.sync = rc.sync;
    // init
    this.init();
    this.inited = true;

    // update
    if (this.update) {
      if (this.updateInterval > 0) {
        const loop = () => {
          this.update();
          setTimeout(loop, this.updateInterval);
        };
        loop();
      }
      this.update();
    }
  }

  init() {}
  // update() {}
}
