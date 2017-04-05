import LogSender from './logSender';
import CommandReducer from './commandReducer';

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
  }
}
