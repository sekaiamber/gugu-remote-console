import LogSender from './logSender';
import CommandReducer from './commandReducer';
import NetworkCollector from './networkCollector';
import InfoCollector from './infoCollector';
import FeatureDetector from './featureDetector';

function UUID() {
  const now = new Date();
  return `${now.getTime()}_${window.location.host}`;
}

export default class RemoteConsole {
  constructor(uuid) {
    this.wilddog = window.wilddog;
    this.uuid = uuid || UUID();
    const config = {
      syncURL: 'https://remote-console.wilddogio.com/',
    };
    this.wilddog.initializeApp(config);
    this.sync = this.wilddog.sync();
    this.logSender = new LogSender(this);
    this.commandReducer = new CommandReducer(this);
    this.networkCollector = new NetworkCollector(this);
    this.InfoCollector = new InfoCollector(this);
    this.FeatureDetector = new FeatureDetector(this);
  }
}
