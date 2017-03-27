import './init';
import rcInit from './remoteConsole';

// 通过document.currentScript来获取脚本文件名
const currentScript = document.currentScript;
if (currentScript !== 0) {
  const url = currentScript.src;
  if (url) {
    const querys = url.replace(/^[^?]+\??/, '').split(/[&?]/).map(q => q.split('='));
    const queryobj = {};
    for (let i = 0; i < querys.length; i += 1) {
      queryobj[querys[i][0]] = querys[i][1];
    }
    rcInit(queryobj);
  }
}
