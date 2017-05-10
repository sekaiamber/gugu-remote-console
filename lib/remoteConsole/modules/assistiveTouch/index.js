import LZString from 'lz-string';
import BaseModule from '../../baseModule';
import connectStore from '../../connectStore';
import style from './assistiveTouch.scss';
import { createElement } from '../../../utils/dom';
import { getComputedStyle, removeDefComputedStyle, getMatchedCSSRules, getDomStructureInfo, isGuguElement, triggerClass } from './utils';
// modules
import Selector from './modules/selector';
import Highlighter from './modules/highlighter';
import ConnectDetector from './modules/connectDetector';

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

/* eslint no-confusing-arrow: 0 */
const storeConfig = {
  writers: {
    element: { clean: true, beforeSend: (data, encodeData) => data ? LZString.compressToUTF16(encodeData) : data },
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
    // connect detector
    this.connectDetector = new ConnectDetector(this, $trigger);


    $at.appendChild($btList);
    $at.appendChild($trigger);
    document.body.appendChild($at);
    return $at;
  }
  initElementSelector() {
    this.highlighter = new Highlighter();
    this.selector = new Selector(isGuguElement);
    this.selector.on('select', ($el) => {
      if (!$el) return;
      // 箱模型
      const info = this.highlighter.highlight($el);
      // 基础信息
      info.tag = $el.tagName.toLowerCase;
      info.className = $el.className;
      info.id = $el.id;
      // computedStyle
      let computedStyle = getComputedStyle($el);
      computedStyle = removeDefComputedStyle(computedStyle);
      info.computedStyle = computedStyle;
      // 样式表
      const styleSheets = getMatchedCSSRules($el);
      info.styleSheets = styleSheets;
      // style属性
      info.styleAttr = $el.getAttribute('style');
      // dom层级信息
      info.structure = getDomStructureInfo($el);
      this.setData('element', info);
    });
    const $selectorBt = createElement('div', 'gugu-at-selector', '选');
    bindTouchClick($selectorBt, this.triggerSelectElement.bind(this));

    // 远端选择
    this.onDataChange('element_select_to', (json) => {
      const position = JSON.parse(json);
      const $selectTo = this.selector.getRelativeDom(position);
      if ($selectTo) {
        this.selector.emit('select', $selectTo);
      }
    });
    // 远端样式
    this.onDataChange('element_style_to', (newStyle) => {
      this.selector.setCurrentStyle(newStyle);
      this.selector.updateCurrent();
    });
    return $selectorBt;
  }

  // trigger event
  triggerAtOpen() {
    triggerClass(this.$at, 'show', this.$at.className.indexOf('show') === -1);
  }
  // element selector event
  triggerSelectElement(e) {
    const $selectorBt = e.target;
    if (this.selector.enabled) {
      this.selector.disable();
      this.highlighter.highlight(null);
      // this.setData('element', null);
    } else {
      this.selector.enable();
    }
    triggerClass($selectorBt, 'active', this.selector.enabled);
  }

}
