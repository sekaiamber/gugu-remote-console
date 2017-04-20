import LZString from 'lz-string';
import features from '../../lib/constants/features.json';

let syncLogRef;
let syncCommandRef;
let syncNetworkResourcesRef;
let syncNetworkRequestsRef;
let syncInfoRef;
let syncFeaturesRef;
let syncConfigsRef;
let syncElementSelectRef;

export default class RC {
  constructor(uuid, conf = {}) {
    this.wilddog = window.wilddog;
    this.uuid = uuid;

    if (conf.onLogAdd) this.onLogAdd = conf.onLogAdd;
    if (conf.onLogRemove) this.onLogRemove = conf.onLogRemove;
    if (conf.onCommandResponse) this.onCommandResponse = conf.onCommandResponse;
    if (conf.onNetworkResourcesChange) this.onNetworkResourcesChange = conf.onNetworkResourcesChange;
    if (conf.onNetworkRequestsChange) this.onNetworkRequestsChange = conf.onNetworkRequestsChange;
    if (conf.onInfoChange) this.onInfoChange = conf.onInfoChange;
    if (conf.onFeaturesChange) this.onFeaturesChange = conf.onFeaturesChange;
    if (conf.onConfigsChange) this.onConfigsChange = conf.onConfigsChange;
    if (conf.onSelectElementChange) this.onSelectElementChange = conf.onSelectElementChange;

    const config = {
      syncURL: 'https://remote-console.wilddogio.com/',
    };
    this.wilddog.initializeApp(config);
    this.sync = this.wilddog.sync();
    syncLogRef = this.sync.ref(`screens/${this.uuid}`);
    syncCommandRef = this.sync.ref(`commands/${this.uuid}`);
    syncNetworkResourcesRef = this.sync.ref(`networks/${this.uuid}/resources`);
    syncNetworkRequestsRef = this.sync.ref(`networks/${this.uuid}/requests`);
    syncInfoRef = this.sync.ref(`infos/${this.uuid}`);
    syncFeaturesRef = this.sync.ref(`features/${this.uuid}`);
    syncConfigsRef = this.sync.ref(`configs/${this.uuid}`);
    syncElementSelectRef = this.sync.ref(`element/${this.uuid}/select`);

    // logs
    syncLogRef.endAt(0).limitToLast(10).on('child_added', (snapshot) => {
      const val = snapshot.val();
      this.onLogAdd(val.log, val.caller, snapshot.key());
    });

    syncLogRef.on('child_removed', (snapshot) => {
      this.onLogRemove(snapshot.key());
    });

    // commands
    syncCommandRef.child('response').on('value', (snapshot) => {
      const response = snapshot.val();
      if (response) {
        this.onCommandResponse(response);
      }
    });

    // network resources
    syncNetworkResourcesRef.on('value', (snapshot) => {
      const value = snapshot.val();
      if (value) {
        this.onNetworkResourcesChange(JSON.parse(value));
      } else {
        this.onNetworkResourcesChange([]);
      }
    });

    // network requests
    syncNetworkRequestsRef.on('value', (snapshot) => {
      const value = snapshot.val();
      if (value) {
        this.onNetworkRequestsChange(JSON.parse(value));
      } else {
        this.onNetworkRequestsChange([]);
      }
    });

    // info
    syncInfoRef.on('value', (snapshot) => {
      const info = snapshot.val();
      if (info) {
        Object.keys(info).forEach((key) => {
          info[key] = JSON.parse(info[key]);
        });
        this.onInfoChange(info);
      } else {
        this.onInfoChange({});
      }
    });

    // feature
    syncFeaturesRef.on('value', (snapshot) => {
      let value = snapshot.val();
      if (value) {
        value = JSON.parse(value);
        const des = {};
        features.forEach((feature, i) => {
          des[feature.des] = value[i] === '1';
        });
        this.onFeaturesChange(des);
      } else {
        this.onFeaturesChange({});
      }
    });

    // config
    this.configs = null;
    syncConfigsRef.on('value', (snapshot) => {
      const configs = snapshot.val();
      this.configs = configs;
      if (configs) {
        this.onConfigsChange(configs);
      } else {
        this.onConfigsChange({});
      }
    });

    // element
    syncElementSelectRef.on('value', (snapshot) => {
      const encodeInfo = snapshot.val();
      if (encodeInfo) {
        const info = LZString.decompressFromUTF16(encodeInfo);
        this.onSelectElementChange(JSON.parse(info));
      // } else {
      //   this.onSelectElementChange({});
      }
    });
  }

  onLogAdd(members /* , caller, key */) {
    console.log(...members);
  }

  onLogRemove(/* key */) {}

  sendCommand(command) {
    const request = {
      data: command,
      id: new Date().getTime() + '_' + parseInt(Math.random() * 100, 10),
    };
    syncCommandRef.update({
      command: request,
    });
  }
  changeConfigs(configs) {
    const send = {};
    Object.keys(configs).forEach((key) => {
      if (this.configs[key] !== configs[key]) {
        send[key] = configs[key];
      }
    });
    if (Object.keys(send).length === 0) {
      console.log(0);
    } else {
      syncConfigsRef.update(send);
    }
  }

  onCommandResponse(/* response */) {}

  onNetworkResourcesChange(/* resources */) {}

  onNetworkRequestsChange(/* requests */) {}

  onInfoChange(/* info */) {}

  onFeaturesChange(/* features */) {}

  onConfigsChange(/* configs */) {}

  onSelectElementChange(/* info */) {}

  disconnect() {
    this.wilddog.sync().goOffline();
  }
}
