import '!!style-loader!css-loader!autoprefixer?{browsers:["last 2 version", "> 1%"]}!sass!./index.scss';
import $ from 'jquery';
import RC from './rc';

let rc;

function cutString(str, length = 50) {
  if (str.length <= length) return str;
  const ret = str.slice(0, length - 3);
  return ret + '...';
}

function chanageNetworkRequestsModalContent(obj) {
  const $content = $('#networkRequestsModalContent');
  $content.empty();
  $content.append(`<h5>${obj.name}</h5>`);
  $content.append(`<dl class="dl-horizontal"> <dt>Method</dt><dd>${obj.method}</dd> </dl>`);
  $content.append(`<dl class="dl-horizontal"> <dt>URL</dt><dd>${obj.url}</dd> </dl>`);
  if (obj.done) {
    $content.append(`<dl class="dl-horizontal"> <dt>Status</dt><dd>${obj.status}</dd> </dl>`);
    $content.append(`<dl class="dl-horizontal"> <dt>Time</dt><dd>${obj.displayTime}</dd> </dl>`);
    if (obj.data) $content.append(`<dl class="dl-horizontal"> <dt>Data</dt><dd>${obj.data}</dd> </dl>`);
    $content.append('<h6>Response</h6>');
    $content.append(`<dl class="dl-horizontal"> <dt>Size</dt><dd>${obj.size}</dd> </dl>`);
    const $resHeaders = $('<dl class="dl-horizontal"> <dt>Headers</dt> </dl>');
    const $resHeadersDd = $('<dd></dd>');
    Object.keys(obj.resHeaders).forEach((key) => {
      $resHeadersDd.append(`<div>${key} : ${obj.resHeaders[key]}</div>`);
    });
    $resHeaders.append($resHeadersDd);
    $content.append($resHeaders);
    $content.append(`<dl class="dl-horizontal"> <dt>Preview</dt><dd>${obj.resTxt}</dd> </dl>`);
  } else {
    $content.append('<dl class="dl-horizontal"> <dt>Status</dt><dd>Pending</dd> </dl>');
  }
}

const configDescription = {
  Ce: 'Enable Command Module',
  Ie: 'Enable Info Module',
  Le: 'Enable Log Module',
  Ne: 'Enable Network Module',
  Nq: 'Enable Network Module XMRs Feature',
  Nr: 'Enable Network Module Resources Feature',
};

$(document).ready(() => {
  const $logInput = $('#log');
  const $logs = $('#logs');
  const $commandInput = $('#command');
  const $commandResponse = $('#commandResponse');
  const $commandResponseError = $('#commandResponseError');
  const $networkResourcesTableBody = $('#networkResourcesTableBody');
  const $networkRequestsTableBody = $('#networkRequestsTableBody');
  const $networkRequestsModal = $('#networkRequestsModal');
  const $infoLocation = $('#infoLocation');
  const $infoUserAgent = $('#infoUserAgent');
  const $infoDevice = $('#infoDevice');
  const $featuresRow = $('#featuresRow');
  const $configsList = $('#configsList');

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
      onNetworkResourcesChange(resources) {
        $networkResourcesTableBody.empty();
        for (let i = 0; i < resources.length; i += 1) {
          const res = resources[i];
          $networkResourcesTableBody.append(`<tr> <td>${res.name}</td> <td>${res.initiatorType}</td> <td>${res.displayTime}</td> <td>${res.url}</td> </tr>`);
        }
      },
      onNetworkRequestsChange(requests) {
        $networkRequestsTableBody.empty();
        for (let i = 0; i < requests.length; i += 1) {
          const req = requests[i];
          const $a = $(`<a>${cutString(req.name)}<a>`);
          $a.click(() => {
            chanageNetworkRequestsModalContent(req);
            $networkRequestsModal.modal('show');
          });
          const $bt = $('<td></td>');
          $bt.append($a);
          const $tr = $(`<tr> <td>${req.status}</td> <td>${req.method}</td> <td>${req.subType}</td> <td>${req.size}</td> <td>${req.displayTime}</td> </tr>`);
          $tr.prepend($bt);
          $networkRequestsTableBody.append($tr);
        }
      },
      onInfoChange(info) {
        $infoLocation.html(info.location || '');
        $infoUserAgent.html(info.userAgent || '');
        $infoDevice.empty();
        if (info.device) {
          Object.keys(info.device).forEach((key) => {
            $infoDevice.append(`<dl class="dl-horizontal"> <dt>${key}</dt><dd>${info.device[key]}</dd> </dl>`);
          });
        }
      },
      onFeaturesChange(features) {
        $featuresRow.empty();
        $featuresRow.append('<div class="col-sm-12"><p class="bg-info text-center"><a target="_blank" href="http://html5test.com" ontouchstart="">Go To HTML5 Test To See All Features</a></p></div>');
        const names = Object.keys(features);
        names.sort();
        names.forEach((name) => {
          $featuresRow.append(`<div class="col-sm-4"><p class="${features[name] ? 'bg-success' : 'bg-danger'} text-center">${name}</p></div>`);
        });
        $featuresRow.append('<div class="col-sm-12"><p class="bg-info text-center"><a target="_blank" href="http://html5test.com" ontouchstart="">Go To HTML5 Test To See All Features</a></p></div>');
      },
      onConfigsChange(configs) {
        $configsList.empty();
        const $submit = $('<button class="btn btn-default" id="connect">Change Setting</button>');
        $submit.click(() => {
          const config = {};
          $('[configName]').each((i, elem) => {
            const c = $(elem);
            if (c.attr('configType') === 'boolean') {
              config[c.attr('configName')] = c.is(':checked');
            }
          });
          rc.changeConfigs(config);
        });
        $configsList.append($submit);
        Object.keys(configs).forEach((key) => {
          const value = configs[key];
          let $conf;
          if (typeof value === 'boolean') {
            $conf = $(`<div class="checkbox"><label><input type="checkbox" configName="${key}" configType="boolean" ${value ? 'checked' : ''}>${configDescription[key]}</label></div>`);
          }
          if ($conf) {
            $configsList.append($conf);
          }
        });
      },
    });
  });

  $('#send').click(() => {
    if (rc) {
      rc.sendCommand($commandInput.val());
    }
  });
});
