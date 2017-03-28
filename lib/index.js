import './init';
import rcInit from './remoteConsole';
import { getCurrentScriptSrc } from './utils';

const url = getCurrentScriptSrc();
alert(url);
if (url) {
  const querys = url.replace(/^[^?]+\??/, '').split(/[&?]/).map(q => q.split('='));
  const queryobj = {};
  for (let i = 0; i < querys.length; i += 1) {
    queryobj[querys[i][0]] = querys[i][1];
  }
  rcInit(queryobj);
}
