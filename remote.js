!function(e){function n(o){if(t[o])return t[o].exports;var d=t[o]={exports:{},id:o,loaded:!1};return e[o].call(d.exports,d,d.exports,n),d.loaded=!0,d.exports}var t={};return n.m=e,n.c=t,n.p="",n(0)}({0:function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function d(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:50;if(e.length<=n)return e;var t=e.slice(0,n-3);return t+"..."}function a(e){var n=(0,r.default)("#networkRequestsModalContent");if(n.empty(),n.append("<h5>"+e.name+"</h5>"),n.append('<dl class="dl-horizontal"> <dt>Method</dt><dd>'+e.method+"</dd> </dl>"),n.append('<dl class="dl-horizontal"> <dt>URL</dt><dd>'+e.url+"</dd> </dl>"),e.done){n.append('<dl class="dl-horizontal"> <dt>Status</dt><dd>'+e.status+"</dd> </dl>"),n.append('<dl class="dl-horizontal"> <dt>Time</dt><dd>'+e.displayTime+"</dd> </dl>"),e.data&&n.append('<dl class="dl-horizontal"> <dt>Data</dt><dd>'+e.data+"</dd> </dl>"),n.append("<h6>Response</h6>"),n.append('<dl class="dl-horizontal"> <dt>Size</dt><dd>'+e.size+"</dd> </dl>");var t=(0,r.default)('<dl class="dl-horizontal"> <dt>Headers</dt> </dl>'),o=(0,r.default)("<dd></dd>");Object.keys(e.resHeaders).forEach(function(n){o.append("<div>"+n+" : "+e.resHeaders[n]+"</div>")}),t.append(o),n.append(t),n.append('<dl class="dl-horizontal"> <dt>Preview</dt><dd>'+e.resTxt+"</dd> </dl>")}else n.append('<dl class="dl-horizontal"> <dt>Status</dt><dd>Pending</dd> </dl>')}var s=t(30),r=o(s),l=t(29),i=o(l);t(19);var u=void 0;(0,r.default)(document).ready(function(){var e=(0,r.default)("#log"),n=(0,r.default)("#logs"),t=(0,r.default)("#command"),o=(0,r.default)("#commandResponse"),s=(0,r.default)("#commandResponseError"),l=(0,r.default)("#networkResourcesTableBody"),c=(0,r.default)("#networkRequestsTableBody"),f=(0,r.default)("#networkRequestsModal"),p=(0,r.default)("#infoLocation"),h=(0,r.default)("#infoUserAgent"),v=(0,r.default)("#infoDevice");(0,r.default)("#connect").click(function(){u&&u.disconnect(),u=new i.default(e.val(),{onLogAdd:function(e,t,o){for(var d=(0,r.default)('<div class="log" log-id="'+o+'"></div>'),a=0;a<e.length;a+=1)d.append((0,r.default)('<div class="log-part">'+e[a]+"</div>"));d.append((0,r.default)('<div class="caller">'+t+"</div>")),n.append(d)},onLogRemove:function(){n.empty()},onCommandResponse:function(e){if(e.success)o.html(e.data),s.empty();else{o.html(e.data.message);var n=t.val().split("\n");if(e.data.lineNumber){var d=n[e.data.lineNumber-1];if(e.data.columnNumber){var a=d.slice(0,e.data.columnNumber-1),r=d.slice(e.data.columnNumber),l=d[e.data.columnNumber-1];d=a+'<span class="error">'+l+"</span>"+r}d='<span class="error">'+d+"</span>",n[e.data.lineNumber-1]=d}n=n.join("\n"),s.html("<pre>"+n+"</pre>")}},onNetworkResourcesChange:function(e){l.empty();for(var n=0;n<e.length;n+=1){var t=e[n];l.append("<tr> <td>"+t.name+"</td> <td>"+t.initiatorType+"</td> <td>"+t.displayTime+"</td> <td>"+t.url+"</td> </tr>")}},onNetworkRequestsChange:function(e){c.empty();for(var n=function(n){var t=e[n],o=(0,r.default)("<a>"+d(t.name)+"<a>");o.click(function(){a(t),f.modal("show")});var s=(0,r.default)("<td></td>");s.append(o);var l=(0,r.default)("<tr> <td>"+t.status+"</td> <td>"+t.method+"</td> <td>"+t.subType+"</td> <td>"+t.size+"</td> <td>"+t.displayTime+"</td> </tr>");l.prepend(s),c.append(l)},t=0;t<e.length;t+=1)n(t)},onInfoChange:function(e){p.html(e.location||""),h.html(e.userAgent||""),v.empty(),e.device&&Object.keys(e.device).forEach(function(n){v.append('<dl class="dl-horizontal"> <dt>'+n+"</dt><dd>"+e.device[n]+"</dd> </dl>")})}})}),(0,r.default)("#send").click(function(){u&&u.sendCommand(t.val())})})},19:function(e,n){},29:function(e,n){"use strict";function t(e){if(Array.isArray(e)){for(var n=0,t=Array(e.length);n<e.length;n++)t[n]=e[n];return t}return Array.from(e)}function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var d=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=void 0,s=void 0,r=void 0,l=void 0,i=void 0,u=function(){function e(n){var t=this,d=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};o(this,e),this.wilddog=window.wilddog,this.uuid=n,d.onLogAdd&&(this.onLogAdd=d.onLogAdd),d.onLogRemove&&(this.onLogRemove=d.onLogRemove),d.onCommandResponse&&(this.onCommandResponse=d.onCommandResponse),d.onNetworkResourcesChange&&(this.onNetworkResourcesChange=d.onNetworkResourcesChange),d.onNetworkRequestsChange&&(this.onNetworkRequestsChange=d.onNetworkRequestsChange),d.onInfoChange&&(this.onInfoChange=d.onInfoChange);var u={syncURL:"https://remote-console.wilddogio.com/"};this.wilddog.initializeApp(u),this.sync=this.wilddog.sync(),a=this.sync.ref("screens/"+this.uuid),s=this.sync.ref("commands/"+this.uuid),r=this.sync.ref("networks/"+this.uuid+"/resources"),l=this.sync.ref("networks/"+this.uuid+"/requests"),i=this.sync.ref("infos/"+this.uuid),a.endAt(0).limitToLast(10).on("child_added",function(e){var n=e.val();t.onLogAdd(n.log,n.caller,e.key())}),a.on("child_removed",function(e){t.onLogRemove(e.key())}),s.child("response").on("value",function(e){var n=e.val();n&&t.onCommandResponse(n)}),r.on("value",function(e){var n=e.val();n?t.onNetworkResourcesChange(JSON.parse(n)):t.onNetworkResourcesChange([])}),l.on("value",function(e){var n=e.val();n?t.onNetworkRequestsChange(JSON.parse(n)):t.onNetworkRequestsChange([])}),i.on("value",function(e){var n=e.val();n?(Object.keys(n).forEach(function(e){n[e]=JSON.parse(n[e])}),t.onInfoChange(n)):t.onInfoChange({})})}return d(e,[{key:"onLogAdd",value:function(e){var n;(n=console).log.apply(n,t(e))}},{key:"onLogRemove",value:function(){}},{key:"sendCommand",value:function(e){var n={data:e,id:(new Date).getTime()+"_"+parseInt(100*Math.random(),10)};s.update({command:n})}},{key:"onCommandResponse",value:function(){}},{key:"onNetworkResourcesChange",value:function(){}},{key:"onNetworkRequestsChange",value:function(){}},{key:"onInfoChange",value:function(){}},{key:"disconnect",value:function(){this.wilddog.sync().goOffline()}}]),e}();n.default=u},30:function(e,n){e.exports=$}});