import '../utils/modernizr';
import { CompareSender } from '../utils/object';
import features from '../constants/features.json';

export default class FeatureDetector {
  constructor(rc) {
    this.remoteConsole = rc;
    this.sync = rc.sync;

    this.features = new CompareSender(this.sendFeatures.bind(this));
    this.syncRef = null;
    this.init();
  }

  init() {
    this.syncRef = this.sync.ref(`features/${this.remoteConsole.uuid}`);
    this.syncRef.remove();
    const results = [];
    for (let i = 0; i < features.length; i += 1) {
      results.push(window.Modernizr[features[i].key] ? 1 : 0);
    }
    this.features.set(results.join(''));
  }

  sendFeatures(encodeData) {
    this.syncRef.set(encodeData);
  }
}
