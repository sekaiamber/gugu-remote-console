import defComputedStyle from '../../../constants/defComputedStyle.json';

function formatStyle(style) {
  const ret = {};
  for (let i = 0, len = style.length; i < len; i += 1) {
    const name = style[i];
    if (style[name] !== 'initial') {
      ret[name] = style[name];
    }
  }
  return ret;
}

function getComputedStyle($el) {
  const cs = window.getComputedStyle($el);

  return formatStyle(cs);
}

function removeDefComputedStyle(computedStyle) {
  const ret = {};
  Object.keys(computedStyle).forEach((key) => {
    const val = computedStyle[key];
    if (val === defComputedStyle[key]) return;
    ret[key] = val;
  });
  return ret;
}

let matchesSel = () => false;

if (Element.prototype.webkitMatchesSelector) {
  matchesSel = (el, selText) => el.webkitMatchesSelector(selText);
} else if (Element.prototype.mozMatchesSelector) {
  matchesSel = (el, selText) => el.mozMatchesSelector(selText);
}

function getMatchedCSSRules($el) {
  const ret = [];
  for (let i = 0; i < document.styleSheets.length; i += 1) {
    const styleSheet = document.styleSheets[i];
    if (styleSheet.cssRules) {
      [].forEach.call(styleSheet.cssRules, (cssRule) => {
        let matchesEl = false;

        // Mobile safari will throw DOM Exception 12 error, need to try catch it.
        try {
          matchesEl = matchesSel($el, cssRule.selectorText);
        /* eslint-disable no-empty */
        } catch (e) {}

        if (!matchesEl) return;

        ret.push({
          selector: cssRule.selectorText,
          style: formatStyle(cssRule.style),
        });
      });
    }
  }
  return ret;
}

function isGuguElement($el) {
  return $el.className.indexOf('gugu-') > -1;
}

function getDomBaseInfo($el) {
  return [
    $el.tagName.toLowerCase(),
    $el.id,
    $el.className,
  ];
}

function getDomStructureInfo($el) {
  const info = {
    parents: [],
    brothers: [],
    index: -1,
  };
  let father = $el.parentNode;
  if (father) {
    [].forEach.call(father.children, ($bro, i) => {
      if (!isGuguElement($bro)) {
        if ($bro === $el) info.index = i;
        info.brothers.push(getDomBaseInfo($bro));
      }
    });
    while (father && father !== document) {
      info.parents.push(getDomBaseInfo(father));
      father = father.parentNode;
    }
  }
  return info;
}

/* eslint no-param-reassign:0 */
function triggerClass($el, classname, show) {
  if (!show) {
    $el.className = $el.className.replace(' ' + classname, '').replace(classname, '');
  } else if ($el.className.indexOf(classname) === -1) {
    $el.className += ' ' + classname;
  }
}

export {
  formatStyle,
  getComputedStyle,
  removeDefComputedStyle,
  getMatchedCSSRules,
  getDomStructureInfo,
  isGuguElement,
  triggerClass,
};
