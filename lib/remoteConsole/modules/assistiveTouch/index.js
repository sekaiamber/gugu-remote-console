import BaseModule from '../../baseModule';
import connectStore from '../../connectStore';
import style from './assistiveTouch.scss';
import { createElement } from '../../../utils/dom';
// modules
import Selector from './modules/selector';
import Highlighter from './modules/highlighter';

function bindTouchClick($el, callback, opt = true) {
  $el.addEventListener('mousedown', callback, opt);
  // function touchWrapper(e) {
  //   callback();
  //   e.preventDefault();
  //   e.stopPropagation();
  // }
  // $el.addEventListener('touchstart', touchWrapper, opt);

  return function cancelBind() {
    $el.removeEventListener('mousedown', callback);
    // $el.removeEventListener('touchstart', touchWrapper);
  };
}

const storeConfig = {
  writers: {
    element: { clean: true },
  },
};

// element模式在客户端提供一个AssistiveTouch来作为功能菜单
@connectStore(storeConfig)
export default class AssistiveTouch extends BaseModule {
  init() {
    const $style = createElement('style', '', style);
    document.head.appendChild($style);
    this.$at = this.initAt();
  }

  initAt() {
    // AssistiveTouch
    const $at = createElement('div', 'gugu-at-bt');
    // trigger
    const $trigger = createElement('div', 'gugu-at-trigger');
    bindTouchClick($trigger, this.triggerAtOpen.bind(this));
    // list
    const $btList = createElement('div', 'gugu-at-list');
    // selector
    const $selectorBt = this.initElementSelector();
    $btList.appendChild($selectorBt);


    $at.appendChild($btList);
    $at.appendChild($trigger);
    document.body.appendChild($at);
    return $at;
  }
  initElementSelector() {
    this.highlighter = new Highlighter();
    this.selector = new Selector($el => $el.className.indexOf('gugu-') > -1);
    this.selector.on('select', ($el) => {
      this.highlighter.highlight($el);
    });
    const $selectorBt = createElement('div', 'gugu-at-selector', '选');
    bindTouchClick($selectorBt, this.triggerSelectElement.bind(this));
    return $selectorBt;
  }

  // trigger event
  triggerAtOpen() {
    this.triggerClass(this.$at, 'show', this.$at.className.indexOf('show') === -1);
  }
  /* eslint no-param-reassign:0 */
  triggerClass($el, classname, show) {
    if (!show) {
      $el.className = $el.className.replace(' ' + classname, '');
    } else if ($el.className.indexOf(classname) === -1) {
      $el.className += ' ' + classname;
    }
  }
  // element selector event
  triggerSelectElement(e) {
    const $selectorBt = e.target;
    if (this.selector.enabled) {
      this.selector.disable();
    } else {
      this.selector.enable();
    }
    this.triggerClass($selectorBt, 'active', this.selector.enabled);
  }

}