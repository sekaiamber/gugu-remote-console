import './init';
import rcInit from './remoteConsole';
import { getErrorStack, urlReg } from './utils';

// 通过错误堆栈来找到触发脚本
const errorStack = getErrorStack(new Error());
if (errorStack.length !== 0) {
  const lastError = errorStack[errorStack.length - 1];
  // 这里我们默认没有二次堆栈调用
  const urlmatch = lastError.match(urlReg);

  if (urlmatch.length > 0) {
    const script = urlmatch[0];
    const querys = script.replace(/^[^?]+\??/, '').split(/[&?]/).map(q => q.split('='));
    const queryobj = {};
    for (let i = 0; i < querys.length; i += 1) {
      queryobj[querys[i][0]] = querys[i][1];
    }
    rcInit(queryobj);
  }
}
