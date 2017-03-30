import $ from 'jquery';
import RC from './rc';
import './index.scss';

let rc;

$(document).ready(() => {
  const $logInput = $('#log');
  const $logs = $('#logs');
  const $commandInput = $('#command');
  const $commandResponse = $('#commandResponse');
  const $commandResponseError = $('#commandResponseError');

  $('#connect').click(() => {
    if (rc) rc.disconnect();
    rc = new RC($logInput.val(), {
      onLogAdd(members, caller, key) {
        const $log = $(`<div class="log" log-id="${key}"></div>`);
        for (let i = 0; i < members.length; i += 1) {
          $log.append($(`<div class="log-part">${members[i]}</div>`));
        }
        $log.append($(`<div class="caller">${caller}</div>`));
        $logs.append($log);
      },
      onLogRemove() {
        $logs.empty();
      },
      onCommandResponse(resp) {
        if (resp.success) {
          $commandResponse.html(resp.data);
          $commandResponseError.empty();
        } else {
          $commandResponse.html(resp.data.message);
          let lines = $commandInput.val().split('\n');
          console.log(resp.data);
          if (resp.data.lineNumber) {
            let line = lines[resp.data.lineNumber - 1];
            if (resp.data.columnNumber) {
              const lineBegin = line.slice(0, resp.data.columnNumber - 1);
              const lineEnd = line.slice(resp.data.columnNumber);
              const errorChar = line[resp.data.columnNumber - 1];
              line = lineBegin + '<span class="error">' + errorChar + '</span>' + lineEnd;
            }
            line = '<span class="error">' + line + '</span>';
            lines[resp.data.lineNumber - 1] = line;
          }
          lines = lines.join('\n');
          $commandResponseError.html('<pre>' + lines + '</pre>');
        }
      },
    });
  });

  $('#send').click(() => {
    if (rc) {
      rc.sendCommand($commandInput.val());
    }
  });
});
