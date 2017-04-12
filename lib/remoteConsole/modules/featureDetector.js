import BaseModule from '../baseModule';
import '../../utils/modernizr';
import features from '../../constants/features.json';

export default class FeatureDetector extends BaseModule {
  init() {
    // store
    this.storeKeys = ['feature'];
    this.store.registerWriter('feature', undefined, {
      clean: true,
    });
    const results = [];
    for (let i = 0; i < features.length; i += 1) {
      results.push(window.Modernizr[features[i].key] ? 1 : 0);
    }
    this.setData('feature', results.join(''));
  }
}
