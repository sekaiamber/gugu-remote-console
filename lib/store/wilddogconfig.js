import getPaths from './wilddogPaths';
import * as _ from '../utils/lodash';

const config = {
  logs: {
    setDataMethod: 'push',
  },
  feature: {},
  info_location: {},
  info_userAgent: {},
  info_device: {},
  networks_resources: {},
  network_requests: {},
  commands: {},
  commands_request: {},
  configs: {},
};

export default function getConfig(uuid) {
  const paths = getPaths(uuid);
  const ret = {};
  Object.keys(paths).forEach((key) => {
    const connect = _.extend({}, config[key]);
    _.defaults(connect, {
      setDataMethod: 'set',
    });
    connect.path = paths[key];
    ret[key] = connect;
  });
  return ret;
}
