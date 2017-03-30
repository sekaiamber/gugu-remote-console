import { encoder } from '../utils/object';

/* eslint no-eval: 0 */
const geval = eval;

function getErrorInfo(e) {
  const ret = {
    message: e.message,
    stack: e.stack,
    lineNumber: 0,
    columnNumber: 0,
  };
  if (e.lineNumber !== undefined && e.columnNumber !== undefined) {
    // firefox
    ret.lineNumber = e.lineNumber;
    ret.columnNumber = e.columnNumber;
  } else if (e.line !== undefined && e.column !== undefined) {
    // safari
    ret.lineNumber = e.line;
    ret.columnNumber = e.column;
  } else {
    // other
    const stacks = e.stack.split('\n');
    const evalStack = stacks.find(v => v.indexOf('eval') > -1);
    let lc = evalStack.match(/(:\d+)?:\d+\)/ig);
    if (lc) {
      // [':2539:14)', ':1:1)'] -> ':1:1)' -> ':1:1' -> ['', '1', '1'] -> ['1', '1']
      lc = lc[lc.length - 1].slice(0, -1).split(':').slice(1);
      if (lc[0]) ret.lineNumber = parseInt(lc[0], 10);
      if (lc[1]) ret.columnNumber = parseInt(lc[1], 10);
    }
  }
  return ret;
}

export default class CommandReducer {
  constructor(rc) {
    this.remoteConsole = rc;
    this.sync = rc.sync;

    this.syncRef = this.sync.ref(`commands/${this.remoteConsole.uuid}`);
    this.syncRef.remove();

    this.lastCommandId = '';
    this.listen();
  }

  listen() {
    this.syncRef.child('command').on('value', (snapshot) => {
      const request = snapshot.val();
      if (!request || request.id === this.lastCommandId) return;
      const self = this;
      setTimeout(() => {
        let response = null;
        try {
          response = {
            data: JSON.stringify(encoder(geval(request.data))),
            id: request.id,
            success: true,
          };
        } catch (e) {
          response = {
            data: getErrorInfo(e),
            id: request.id,
            success: false,
          };
        }
        self.lastCommandId = response.id;
        self.syncRef.update({
          response,
        });
      }, 0);
    });
  }
}
