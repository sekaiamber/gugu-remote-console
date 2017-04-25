function createElement(tag, cls = '', innerHTML = '') {
  const $el = document.createElement(tag);
  $el.className = cls;
  $el.innerHTML = innerHTML;
  return $el;
}

// jquery offset
function offset($el) {
  // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
  // Support: IE <=11 only
  // Running getBoundingClientRect on a
  // disconnected node in IE throws an error
  if (!$el.getClientRects().length) {
    return { top: 0, left: 0, width: 0, height: 0 };
  }

  const rect = $el.getBoundingClientRect();

  const doc = $el.ownerDocument;
  const docElem = doc.documentElement;
  const win = doc.defaultView;

  return {
    top: Math.round((rect.top + win.pageYOffset) - docElem.clientTop),
    left: Math.round((rect.left + win.pageXOffset) - docElem.clientLeft),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
}

/* eslint no-param-reassign:0 */
function css($el, key, value, unit = 'px') {
  $el.style[key] = value + unit;
}

export {
  offset,
  createElement,
  css,
};
