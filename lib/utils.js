function getErrorStack(error = {}) {
  const stackstr = error.stack;
  if (!stackstr) return [];
  let stackarr = stackstr.split('\n').map(s => s.trim());
  stackarr.shift();
  stackarr = stackarr.map(s => s.replace(/at/ig, '').trim());
  return stackarr;
}

const urlReg = /^(\b(https?|ftp|file):\/\/)?[-A-Za-z0-9+&@#/%=~_|!:,.;]+(\?[-A-Za-z0-9+&@#/%=~_|]+)?/gi;

export {
  getErrorStack,
  urlReg,
};
