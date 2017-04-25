import Emitter from 'event-emitter';

export default class Selector {
  constructor(noSelect) {
    this.noSelect = noSelect;
    this.enabled = false;
    this._startListener = this._startListener.bind(this);
    this._moveListener = this._moveListener.bind(this);
    this._clickListener = this._clickListener.bind(this);
    this._currentSelect = null;
  }
  _startListener(e) {
    if (this.noSelect(e.target)) return;
    this._timer = setTimeout(() => {
      this._currentSelect = e.target;
      this.emit('select', e.target);
    }, 200);

    return;
  }
  _moveListener() {
    clearTimeout(this._timer);
  }
  _clickListener(e) {
    if (this.noSelect(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  enable() {
    this.disable();
    function addEvent(type, listener) {
      document.body.addEventListener(type, listener, true);
    }
    addEvent('touchstart', this._startListener);
    addEvent('touchmove', this._moveListener);
    addEvent('click', this._clickListener);
    this.enabled = true;
    return this;
  }
  disable() {
    function rmEvent(type, listener) {
      document.body.removeEventListener(type, listener, true);
    }
    rmEvent('touchstart', this._startListener);
    rmEvent('touchmove', this._moveListener);
    rmEvent('click', this._clickListener);
    this.enabled = false;
    return this;
  }
  getRelativeDom(position) {
    const $el = this._currentSelect;
    if (!$el) return null;
    const { type, index } = position;
    let $parent = $el.parentNode;
    if (type === 'parent') {
      let i = 1;
      while (i <= index) {
        $parent = $parent.parentNode;
        i += 1;
      }
      return $parent;
    } else if (type === 'brother') {
      return $parent.children[index];
    }
    return null;
  }
}

Emitter(Selector.prototype);
