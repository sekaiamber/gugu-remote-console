import BeatHeart from 'gugu-remote-utils/lib/beatHeart';
import { triggerClass } from '../utils';
import { createElement } from '../../../../utils/dom';
import style from './connectDetector.scss';

export default class ConnectDetector {
  constructor(moduleInst, $target) {
    this.module = moduleInst;
    this.$target = $target;

    const $style = createElement('style', '', style);
    document.head.appendChild($style);

    this.heart = null;
    this.firstHeartBeat = false;

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
    this.module.onDataChange('heartbeat', (heartbeat) => {
      if (!this.heart || !heartbeat) {
        this.heart = new BeatHeart();
        this.heart.on('beat', (nextBeat) => {
          this.module.setData('heartbeat', nextBeat);
          if (this.firstHeartBeat) {
            triggerClass(this.$target, 'remote-connected', true);
          } else {
            this.firstHeartBeat = true;
          }
        });
        this.heart.on('arrest', () => {
          console.info('remote connect break');
          triggerClass(this.$target, 'remote-connected', false);
        });
        this.heart.beat(heartbeat);
      } else {
        setTimeout(() => {
          this.heart.beat(heartbeat);
        }, 3000);
      }
    });
  }
}
