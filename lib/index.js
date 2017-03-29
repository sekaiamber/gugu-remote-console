import './initGlobal';
import initRemoteConsole from './initRemoteConsole';
import { getCurrentScriptSrc } from './utils';

// 获取当前执行的脚本url
const url = getCurrentScriptSrc();
if (url) {
  const querys = url.replace(/^[^?]+\??/, '').split(/[&?]/).map(q => q.split('='));
  // 取得url配置
  const queryobj = {};
  for (let i = 0; i < querys.length; i += 1) {
    queryobj[querys[i][0]] = querys[i][1];
  }
  initRemoteConsole(queryobj);
}
