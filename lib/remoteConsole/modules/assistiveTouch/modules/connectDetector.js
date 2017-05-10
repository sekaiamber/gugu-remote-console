import { triggerClass } from '../utils';
import { createElement } from '../../../../utils/dom';
import style from './connectDetector.scss';


export default class ConnectDetector {
  constructor(moduleInst, $target) {
    this.module = moduleInst;
    this.$target = $target;

    const $style = createElement('style', '', style);
    document.head.appendChild($style);

    this.init();
  }

  init() {
    this.module.onDataChange('connected', (isConnected) => {
      if (isConnected) {
        triggerClass(this.$target, 'connected', true);
      } else {
        triggerClass(this.$target, 'connected', false);
      }
    });
  }
}
