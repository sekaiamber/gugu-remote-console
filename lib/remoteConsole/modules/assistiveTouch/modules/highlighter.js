import { createElement, offset, css } from '../../../../utils/dom';
import * as _ from '../../../../utils/lodash';
import style from './highlighter.scss';

function formatElName($el) {
  const { id, className } = $el;
  let ret = `<span style="color:#ee78e6">${$el.tagName.toLowerCase()}</span>`;

  if (id !== '') ret += `<span style="color:#ffab66">#${id}</span>`;

  let classes = '';
  if (_.isString(className)) {
    const spl = className.split(/\s+/g);
    spl.forEach((val) => {
      if (_.trim(val) === '') return;
      classes += `.${val}`;
    });
  }

  ret += `<span style="color:#8ed3fb">${classes}</span>`;

  return ret;
}

export default class Highlighter {
  constructor() {
    this.target = null;
    // style
    const $style = createElement('style', '', style);
    document.head.appendChild($style);
    // indicator
    const $highlight = this.$highlight = createElement('div', 'gugu-elements-highlight');
    const $indicator = this.$indicator = createElement('div', 'gugu-indicator');
    const $margin = this.$margin = createElement('div', 'gugu-margin');
    const $border = this.$border = createElement('div', 'gugu-border');
    const $padding = this.$padding = createElement('div', 'gugu-padding');
    const $content = this.$content = createElement('div', 'gugu-content');
    const $size = this.$size = createElement('div', 'gugu-size');

    $indicator.appendChild($margin);
    $indicator.appendChild($border);
    $indicator.appendChild($padding);
    $indicator.appendChild($content);

    $highlight.appendChild($indicator);
    $highlight.appendChild($size);

    document.body.appendChild($highlight);
  }
  highlight($el) {
    if (!$el) {
      css(this.$highlight, 'opacity', 0, '');
      return {};
    }
    css(this.$highlight, 'opacity', 1, '');
    if ($el === this.target) return {};
    // all
    const { left, top, width, height } = offset($el);
    css(this.$highlight, 'left', left);
    css(this.$highlight, 'top', top);
    // 这里的长宽包含border和padding，但是不包含margin
    css(this.$highlight, 'width', width);
    css(this.$highlight, 'height', height);

    const computedStyle = getComputedStyle($el, '');
    const getNumStyle = name => parseFloat(computedStyle.getPropertyValue(name));
    // margin
    const ml = getNumStyle('margin-left');
    const mr = getNumStyle('margin-right');
    const mt = getNumStyle('margin-top');
    const mb = getNumStyle('margin-bottom');
    css(this.$margin, 'left', -ml);
    css(this.$margin, 'top', -mt);
    css(this.$margin, 'width', width + ml + mr);
    css(this.$margin, 'height', height + mt + mb);
    // border
    const bl = getNumStyle('border-left-width');
    const br = getNumStyle('border-right-width');
    const bt = getNumStyle('border-top-width');
    const bb = getNumStyle('border-bottom-width');
    // padding
    const bw = width - bl - br;
    const bh = height - bt - bb;
    css(this.$padding, 'left', bl);
    css(this.$padding, 'top', bt);
    css(this.$padding, 'width', bw);
    css(this.$padding, 'height', bh);
    // content
    const pl = getNumStyle('padding-left');
    const pr = getNumStyle('padding-right');
    const pt = getNumStyle('padding-top');
    const pb = getNumStyle('padding-bottom');
    css(this.$content, 'left', bl + pl);
    css(this.$content, 'top', bt + pt);
    css(this.$content, 'width', bw - pl - pr);
    css(this.$content, 'height', bh - pt - pb);
    // tooltip
    css(this.$size, 'left', -ml);
    css(this.$size, 'top', -mt - (top - mt < 25 ? 0 : 25));
    this.$size.innerHTML = `${formatElName($el)} | ${width} × ${height}`;

    return {
      w: bw - pl - pr,
      h: bh - pt - pb,
      ml,
      mr,
      mt,
      mb,
      bl,
      br,
      bt,
      bb,
      pl,
      pr,
      pt,
      pb,
    };
  }
}
