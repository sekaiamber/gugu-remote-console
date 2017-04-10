!function(e){function t(o){if(n[o])return n[o].exports;var s=n[o]={exports:{},id:o,loaded:!1};return e[o].call(s.exports,s,s.exports,t),s.loaded=!0,s.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}({0:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function s(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:50;if(e.length<=t)return e;var n=e.slice(0,t-3);return n+"..."}function d(e){var t=(0,r.default)("#networkRequestsModalContent");if(t.empty(),t.append("<h5>"+e.name+"</h5>"),t.append('<dl class="dl-horizontal"> <dt>Method</dt><dd>'+e.method+"</dd> </dl>"),t.append('<dl class="dl-horizontal"> <dt>URL</dt><dd>'+e.url+"</dd> </dl>"),e.done){t.append('<dl class="dl-horizontal"> <dt>Status</dt><dd>'+e.status+"</dd> </dl>"),t.append('<dl class="dl-horizontal"> <dt>Time</dt><dd>'+e.displayTime+"</dd> </dl>"),e.data&&t.append('<dl class="dl-horizontal"> <dt>Data</dt><dd>'+e.data+"</dd> </dl>"),t.append("<h6>Response</h6>"),t.append('<dl class="dl-horizontal"> <dt>Size</dt><dd>'+e.size+"</dd> </dl>");var n=(0,r.default)('<dl class="dl-horizontal"> <dt>Headers</dt> </dl>'),o=(0,r.default)("<dd></dd>");Object.keys(e.resHeaders).forEach(function(t){o.append("<div>"+t+" : "+e.resHeaders[t]+"</div>")}),n.append(o),t.append(n),t.append('<dl class="dl-horizontal"> <dt>Preview</dt><dd>'+e.resTxt+"</dd> </dl>")}else t.append('<dl class="dl-horizontal"> <dt>Status</dt><dd>Pending</dd> </dl>')}var a=n(125),r=o(a),i=n(124),l=o(i);n(48);var c=void 0;(0,r.default)(document).ready(function(){var e=(0,r.default)("#log"),t=(0,r.default)("#logs"),n=(0,r.default)("#command"),o=(0,r.default)("#commandResponse"),a=(0,r.default)("#commandResponseError"),i=(0,r.default)("#networkResourcesTableBody"),u=(0,r.default)("#networkRequestsTableBody"),f=(0,r.default)("#networkRequestsModal"),p=(0,r.default)("#infoLocation"),h=(0,r.default)("#infoUserAgent"),y=(0,r.default)("#infoDevice"),v=(0,r.default)("#featuresRow");(0,r.default)("#connect").click(function(){c&&c.disconnect(),c=new l.default(e.val(),{onLogAdd:function(e,n,o){for(var s=(0,r.default)('<div class="log" log-id="'+o+'"></div>'),d=0;d<e.length;d+=1)s.append((0,r.default)('<div class="log-part">'+e[d]+"</div>"));s.append((0,r.default)('<div class="caller">'+n+"</div>")),t.append(s)},onLogRemove:function(){t.empty()},onCommandResponse:function(e){if(e.success)o.html(e.data),a.empty();else{o.html(e.data.message);var t=n.val().split("\n");if(e.data.lineNumber){var s=t[e.data.lineNumber-1];if(e.data.columnNumber){var d=s.slice(0,e.data.columnNumber-1),r=s.slice(e.data.columnNumber),i=s[e.data.columnNumber-1];s=d+'<span class="error">'+i+"</span>"+r}s='<span class="error">'+s+"</span>",t[e.data.lineNumber-1]=s}t=t.join("\n"),a.html("<pre>"+t+"</pre>")}},onNetworkResourcesChange:function(e){i.empty();for(var t=0;t<e.length;t+=1){var n=e[t];i.append("<tr> <td>"+n.name+"</td> <td>"+n.initiatorType+"</td> <td>"+n.displayTime+"</td> <td>"+n.url+"</td> </tr>")}},onNetworkRequestsChange:function(e){u.empty();for(var t=function(t){var n=e[t],o=(0,r.default)("<a>"+s(n.name)+"<a>");o.click(function(){d(n),f.modal("show")});var a=(0,r.default)("<td></td>");a.append(o);var i=(0,r.default)("<tr> <td>"+n.status+"</td> <td>"+n.method+"</td> <td>"+n.subType+"</td> <td>"+n.size+"</td> <td>"+n.displayTime+"</td> </tr>");i.prepend(a),u.append(i)},n=0;n<e.length;n+=1)t(n)},onInfoChange:function(e){p.html(e.location||""),h.html(e.userAgent||""),y.empty(),e.device&&Object.keys(e.device).forEach(function(t){y.append('<dl class="dl-horizontal"> <dt>'+t+"</dt><dd>"+e.device[t]+"</dd> </dl>")})},onFeaturesChange:function(e){v.empty(),v.append('<div class="col-sm-12"><p class="bg-info text-center"><a target="_blank" href="http://html5test.com" ontouchstart="">Go To HTML5 Test To See All Features</a></p></div>');var t=Object.keys(e);t.sort(),t.forEach(function(t){v.append('<div class="col-sm-4"><p class="'+(e[t]?"bg-success":"bg-danger")+' text-center">'+t+"</p></div>")}),v.append('<div class="col-sm-12"><p class="bg-info text-center"><a target="_blank" href="http://html5test.com" ontouchstart="">Go To HTML5 Test To See All Features</a></p></div>')}})}),(0,r.default)("#send").click(function(){c&&c.sendCommand(n.val())})})},8:function(e,t){e.exports=[{key:"audio",des:"HTML5 Audio"},{key:"bloburls",des:"Blob URLs"},{key:"boxshadow",des:"Box Shadow"},{key:"boxsizing",des:"Box Sizing"},{key:"canvas",des:"Canvas"},{key:"cookies",des:"Cookies"},{key:"cssanimations",des:"CSS Animations"},{key:"csscalc",des:"CSS Calc"},{key:"csspointerevents",des:"CSS Pointer Events"},{key:"csstransforms",des:"CSS Transforms"},{key:"csstransforms3d",des:"CSS Transforms 3D"},{key:"csstransitions",des:"CSS Transitions"},{key:"datauri",des:"Data URI"},{key:"fetch",des:"Fetch API"},{key:"filereader",des:"File API"},{key:"filesystem",des:"Filesystem API"},{key:"flexbox",des:"Flexbox"},{key:"fullscreen",des:"Fullscreen API"},{key:"geolocation",des:"Geolocation API"},{key:"hashchange",des:"Hashchange Events"},{key:"history",des:"History API"},{key:"indexeddb",des:"IndexedDB"},{key:"json",des:"JSON"},{key:"localstorage",des:"Local Storage"},{key:"notification",des:"Notification"},{key:"performance",des:"Navigation Timing API"},{key:"placeholder",des:"Placeholder Attribute"},{key:"promises",des:"ES6 Promises"},{key:"queryselector",des:"QuerySelector"},{key:"scriptasync",des:"script[async]"},{key:"scriptdefer",des:"script[defer]"},{key:"serviceworker",des:"ServiceWorker API"},{key:"sessionstorage",des:"Session Storage"},{key:"stylescoped",des:"style[scoped]"},{key:"svg",des:"SVG"},{key:"templatestrings",des:"Template strings"},{key:"touchevents",des:"Touch Events"},{key:"typedarrays",des:"Typed arrays"},{key:"video",des:"HTML5 Video"},{key:"webgl",des:"WebGL API"},{key:"webp",des:"Webp"},{key:"webpalpha",des:"Webp Alpha"},{key:"websockets",des:"WebSockets Support"},{key:"websqldatabase",des:"Web SQL Database"},{key:"xhr2",des:"XMLHttpRequest Level 2"}]},48:function(e,t){},124:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function s(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),r=n(8),i=o(r),l=void 0,c=void 0,u=void 0,f=void 0,p=void 0,h=void 0,y=function(){function e(t){var n=this,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};d(this,e),this.wilddog=window.wilddog,this.uuid=t,o.onLogAdd&&(this.onLogAdd=o.onLogAdd),o.onLogRemove&&(this.onLogRemove=o.onLogRemove),o.onCommandResponse&&(this.onCommandResponse=o.onCommandResponse),o.onNetworkResourcesChange&&(this.onNetworkResourcesChange=o.onNetworkResourcesChange),o.onNetworkRequestsChange&&(this.onNetworkRequestsChange=o.onNetworkRequestsChange),o.onInfoChange&&(this.onInfoChange=o.onInfoChange),o.onFeaturesChange&&(this.onFeaturesChange=o.onFeaturesChange);var s={syncURL:"https://remote-console.wilddogio.com/"};this.wilddog.initializeApp(s),this.sync=this.wilddog.sync(),l=this.sync.ref("screens/"+this.uuid),c=this.sync.ref("commands/"+this.uuid),u=this.sync.ref("networks/"+this.uuid+"/resources"),f=this.sync.ref("networks/"+this.uuid+"/requests"),p=this.sync.ref("infos/"+this.uuid),h=this.sync.ref("features/"+this.uuid),l.endAt(0).limitToLast(10).on("child_added",function(e){var t=e.val();n.onLogAdd(t.log,t.caller,e.key())}),l.on("child_removed",function(e){n.onLogRemove(e.key())}),c.child("response").on("value",function(e){var t=e.val();t&&n.onCommandResponse(t)}),u.on("value",function(e){var t=e.val();t?n.onNetworkResourcesChange(JSON.parse(t)):n.onNetworkResourcesChange([])}),f.on("value",function(e){var t=e.val();t?n.onNetworkRequestsChange(JSON.parse(t)):n.onNetworkRequestsChange([])}),p.on("value",function(e){var t=e.val();t?(Object.keys(t).forEach(function(e){t[e]=JSON.parse(t[e])}),n.onInfoChange(t)):n.onInfoChange({})}),h.on("value",function(e){var t=e.val();if(t){t=JSON.parse(t);var o={};i.default.forEach(function(e,n){o[e.des]="1"===t[n]}),n.onFeaturesChange(o)}else n.onFeaturesChange({})})}return a(e,[{key:"onLogAdd",value:function(e){var t;(t=console).log.apply(t,s(e))}},{key:"onLogRemove",value:function(){}},{key:"sendCommand",value:function(e){var t={data:e,id:(new Date).getTime()+"_"+parseInt(100*Math.random(),10)};c.update({command:t})}},{key:"onCommandResponse",value:function(){}},{key:"onNetworkResourcesChange",value:function(){}},{key:"onNetworkRequestsChange",value:function(){}},{key:"onInfoChange",value:function(){}},{key:"onFeaturesChange",value:function(){}},{key:"disconnect",value:function(){this.wilddog.sync().goOffline()}}]),e}();t.default=y},125:function(e,t){e.exports=$}});