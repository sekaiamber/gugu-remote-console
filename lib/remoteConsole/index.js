import Store from '../store';

import Configurator from './modules/configurator';
import LogSender from './modules/logSender';
import CommandReducer from './modules/commandReducer';
import NetworkCollector from './modules/networkCollector';
import InfoCollector from './modules/infoCollector';
import FeatureDetector from './modules/featureDetector';
import AssistiveTouch from './modules/assistiveTouch';

function UUID() {
  const now = new Date();
  return `${now.getTime()}_${window.location.host}`;
}

export default class RemoteConsole {
  constructor(uuid) {
    this.uuid = uuid || UUID();
    this.store = new Store(uuid);

    this.configurator = new Configurator(this);

    this.logSender = new LogSender(this);
    this.commandReducer = new CommandReducer(this);
    this.networkCollector = new NetworkCollector(this);
    this.infoCollector = new InfoCollector(this);
    this.featureDetector = new FeatureDetector(this);
    this.assistiveTouch = new AssistiveTouch(this);
  }
}
