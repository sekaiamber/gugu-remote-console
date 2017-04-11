function getErrorStack(error = {}) {
  const stackstr = error.stack;
  if (!stackstr) return [];
  let stackarr = stackstr.split('\n').map(s => s.trim());
  stackarr.shift();
  stackarr = stackarr.map(s => s.replace(/at/ig, '').trim());
  return stackarr;
}

const urlReg = /^(\b(https?|ftp|file):\/\/)?[-A-Za-z0-9+&@#/%=~_|!:,.;]+(\?[-A-Za-z0-9+&@#/%=~_|]+)?/gi;

function getCurrentScriptSrc() {
  // for firefox, chrome, edge, some mobile browser
  //   see: http://caniuse.com/#search=document.currentScript
  if (document.currentScript) return document.currentScript.src;
  const err = new Error();
  // all firefox
  //   see: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error/fileName
  if (err.fileName) return err.fileName;
  // process stack
  let stack;
  if (err.stack) {
    stack = err.stack;
  } else {
    // ie, error.stack gets the trace information when the error is raised
    try {
      /* eslint-disable */
      a.b.c();
      /* eslint-enable */
    } catch (e) {
      stack = e.stack;
      if (window.opera) {
        // opera 9 has no e.stack, but e.backtrace, use e.toString()
        stack = (String(err).match(/of linked script \S+/g) || []).join(' ');
      }
    }
  }
  if (stack) {
    // if we get stack string, examples:
    // chrome23:
    //  at http://113.93.50.63/data.js:4:1
    // firefox17:
    // @http://113.93.50.63/query.js:4
    // opera12:
    // @http://113.93.50.63/data.js:4
    // IE10:
    //   at Global code (http://113.93.50.63/data.js:4:1)
    //
    stack = stack.split(/[@ ]/g).pop(); // get content after last line, last space or last @
    stack = stack[0] === '(' ? stack.slice(1, -1) : stack;
    return stack.replace(/(:\d+)?:\d+$/i, ''); // remove line number and char number
  }
  // otherwise, for ie8-10, search in head tag
  const nodes = document.head.getElementsByTagName('script');
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.readyState === 'interactive') {
      return node.src;
    }
  }
  return null;
}

/* eslint-disable */
if (!Array.prototype.find) {
  Array.prototype.find = function find(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
/* eslint-enable */

function getUrlFilename(url) {
  // http://www.aaa.com/bbb.html?ccc=ddd#eee => ['http://www.aaa.com/bbb.html?ccc=ddd', 'eee']
  const ssharp = url.split('#');
  // http://www.aaa.com/bbb.html?ccc=ddd => bbb.html?ccc=ddd
  const sslash = ssharp[0].split('/');
  // ['bbb.html?ccc=ddd', 'eee']
  ssharp[0] = sslash[sslash.length - 1];
  return ssharp.join('#');
}

function NOOP() {}

export {
  getErrorStack,
  urlReg,
  getCurrentScriptSrc,
  getUrlFilename,
  NOOP,
};
