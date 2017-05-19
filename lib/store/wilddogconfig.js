import { _ } from 'gugu-remote-utils';
import getPaths from './wilddogPaths';

const config = {
  logs: {
    setDataMethod: 'push',
  },
};

export default function getConfig(uuid) {
  const paths = getPaths(uuid);
  const ret = {};
  Object.keys(paths).forEach((key) => {
    const connect = _.extend({}, config[key] || {});
    _.defaults(connect, {
      setDataMethod: 'set',
    });
    connect.path = paths[key];
    ret[key] = connect;
  });
  return ret;
}
