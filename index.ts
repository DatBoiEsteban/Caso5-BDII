import App from './app';
import * as http from 'http';
import Logger from './logger/logger';

const port = 3070;

App.set('port', port);
const server = http.createServer(App);
server.listen(port);

server.on('listening', (): void => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  Logger.info(`Listening on ${bind}`);
});
