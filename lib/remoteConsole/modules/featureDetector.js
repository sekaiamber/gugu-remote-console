import features from 'gugu-remote-utils/lib/constants/features.json';
import BaseModule from '../baseModule';
import connectStore from '../connectStore';
import '../../utils/modernizr';

const storeConfig = {
  writers: {
    feature: { clean: true },
  },
};

@connectStore(storeConfig)
export default class FeatureDetector extends BaseModule {
  init() {
    const results = [];
    for (let i = 0; i < features.length; i += 1) {
      results.push(window.Modernizr[features[i].key] ? 1 : 0);
    }
    this.setData('feature', results.join(''));
  }
}
