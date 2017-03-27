import $ from 'jquery';
import RC from './rc';
import './index.scss';

let rc;

$(document).ready(() => {
  const $input = $('#log');
  const $logs = $('#logs');

  $('#connect').click(() => {
    if (rc) rc.disconnect();
    rc = new RC($input.val(), {
      onAdd(members, caller, key) {
        const $log = $(`<div class="log" log-id="${key}"></div>`);
        for (let i = 0; i < members.length; i += 1) {
          $log.append($(`<div class="log-part">${members[i]}</div>`));
        }
        $log.append($(`<div class="caller">${caller}</div>`));
        $logs.append($log);
      },
      onRemove() {
        $logs.empty();
      },
    });
  });
});
