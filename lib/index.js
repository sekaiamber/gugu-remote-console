import './init';
import rcInit from './remoteConsole';

const scripts = [].map.call(document.getElementsByTagName('script'), s => s.src);
let script = scripts.filter(s => s.indexOf('remoteConsole') > -1);
if (script.length > 0) {
  script = script[0];
  const querys = script.replace(/^[^?]+\??/, '').split(/[&?]/).map(q => q.split('='));
  const queryobj = {};
  for (let i = 0; i < querys.length; i += 1) {
    queryobj[querys[i][0]] = querys[i][1];
  }
  rcInit(queryobj);
}
