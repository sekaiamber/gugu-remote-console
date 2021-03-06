import '!!style-loader!css-loader!autoprefixer?{browsers:["last 2 version", "> 1%"]}!sass!./index.scss';
import defComputedStyle from 'gugu-remote-utils/lib/constants/defComputedStyle.json';
import $ from 'jquery';
import RC from './rc';

let rc;

function buildHtmlByStructure(structure, data, hasChild = true) {
  const $ret = $(`<div> &lt;<span class="tag">${structure[0]}</span>${structure[1] ? ' id="' + structure[1] + '"' : ''}${structure[2] ? ' class="' + structure[2] + '"' : ''}&gt;${hasChild ? '<div class="child"></div>' : '...'}&lt;/<span class="tag">${structure[0]}</span>&gt; </div>`);
  $ret.data('info', data);
  return $ret;
}

function cssStringToObject(cssText) {
  const regex = /([\w-]*)\s*:\s*([^;]*)/g;
  let match = regex.exec(cssText);
  const properties = {};
  while (match) {
    properties[match[1]] = match[2].trim();
    match = regex.exec(cssText);
  }
  return properties;
}

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
      onSelectElementChange(info) {
        $('#marginTop').html(info.mt || '-');
        $('#marginLeft').html(info.ml || '-');
        $('#marginRight').html(info.mr || '-');
        $('#marginBottom').html(info.mb || '-');
        $('#borderTop').html(info.bt || '-');
        $('#borderLeft').html(info.bl || '-');
        $('#borderRight').html(info.br || '-');
        $('#borderBottom').html(info.bb || '-');
        $('#paddingTop').html(info.pt || '-');
        $('#paddingLeft').html(info.pl || '-');
        $('#paddingRight').html(info.pr || '-');
        $('#paddingBottom').html(info.pb || '-');
        if (info.w && info.h) {
          $('#contentBox').html(`${info.w} × ${info.h}`);
        } else {
          $('#contentBox').html('&nbsp;');
        }
        const $computedStyleList = $('#computedStyleList').empty();
        const $elementSelector = $('#elementSelector').empty();
        $('#elementStyleAttr input').val('');
        if (info.computedStyle) {
          let styles = {};
          Object.keys(defComputedStyle).forEach((key) => {
            styles[key] = {
              name: key,
              default: true,
              value: defComputedStyle[key],
            };
          });
          Object.keys(info.computedStyle).forEach((key) => {
            styles[key] = {
              name: key,
              default: false,
              value: info.computedStyle[key],
            };
          });
          const styleNames = Object.keys(styles);
          styleNames.sort();
          styles = styleNames.map(name => styles[name]);
          styles.forEach((style) => {
            $computedStyleList.append(`<div class="element-style ${style.default ? 'default' : ''}"> <span class="style-name">${style.name}</span> <span class="style-value">${style.value}</span></div>`);
          });
        }
        const $elementStyleAttrList = $('#elementStyleAttrList').empty();
        const $elementStyleSheetsList = $('#elementStyleSheetsList').empty();
        if (info.styleSheets) {
          info.styleSheets.forEach((styleSheet) => {
            const $sheet = $(`<div class="element-style-sheet">
              <div><span>${styleSheet.selector}</span> {</div>
              <div class="element-style-items"></div>
              <div>}</div>
            </div>`);
            const $list = $('.element-style-items', $sheet);
            Object.keys(styleSheet.style).forEach((name) => {
              $list.append(`<div class="element-style"> <span class="style-name">${name}</span>: <span class="style-value">${styleSheet.style[name]}</span>;</div>`);
            });
            $elementStyleSheetsList.append($sheet);
          });
        }
        if (info.styleAttr) {
          const styleAttr = cssStringToObject(info.styleAttr);
          Object.keys(styleAttr).forEach((name) => {
            const $add = $(`<div class="element-style"> <span class="style-name">${name}</span>: <input class="style-value" />;</div>`);
            $('input', $add).val(styleAttr[name]);
            $elementStyleAttrList.append($add);
          });
        }
        if (info.structure) {
          const structure = info.structure;
          let $parent = $('<div></div>');
          if (structure.parents.length > 0) {
            $parent = buildHtmlByStructure(structure.parents[0], { type: 'parent', index: 0 });
            const $list = $('.child', $parent);
            structure.brothers.forEach((bro, i) => {
              const $bro = buildHtmlByStructure(bro, { type: 'brother', index: i }, false);
              if (i === structure.index) {
                $bro.addClass('active');
                $bro.data('info', null);
              }
              $list.append($bro);
            });
            for (let i = 1; i < structure.parents.length; i += 1) {
              const $pp = buildHtmlByStructure(structure.parents[i], { type: 'parent', index: i });
              $('.child', $pp).append($parent);
              $parent = $pp;
            }
          }
          $elementSelector.append($parent);
        }
      },
      onConnectedChange(connected) {
        if (connected) {
          $('#connectStatus').addClass('connected');
        } else {
          $('#connectStatus').removeClass('connected');
        }
      },
      onRemoteConnectedChange(connected) {
        if (connected) {
          $('#connectStatus').addClass('remote-connected ');
        } else {
          $('#connectStatus').removeClass('remote-connected ');
        }
      },
    });
  });

  $('#send').click(() => {
    if (rc) {
      rc.sendCommand($commandInput.val());
    }
  });
  const $computedStyleShowAll = $('#computedStyleShowAll');
  $computedStyleShowAll.click(() => {
    if ($computedStyleShowAll.is(':checked')) {
      $('#computedStyleList').addClass('show-all');
    } else {
      $('#computedStyleList').removeClass('show-all');
    }
  });

  $('#elementSelector').click((e) => {
    const info = $(e.target).data('info');
    if (info && rc) {
      rc.selectToElement(info);
    }
  });

  $('#changeStyle').click(() => {
    let style = '';
    $('#elementStyleAttr .element-style').each((i, el) => {
      const $el = $(el);
      const $name = $('.style-name', $el);
      const $value = $('.style-value', $el);
      const name = $name.html() || $name.val();
      const value = $value.html() || $value.val();
      if (name && value) {
        style += `${name}: ${value};`;
      }
    });
    rc.styleToElement(style);
  });
});
