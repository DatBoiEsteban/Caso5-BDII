import App from './app';
import * as http from 'http';
import Logger from './logger/logger';


// Guarda el puerto de ejecucion
App.set('port', process.env.PORT || 3070);

// Crea el servidor
const server = http.createServer(App);

// Ejecuta el servidor
server.listen(App.get('port'));

// Cuando el servidor arranque
server.on('listening', () => {

  // Obtiene los datos de la direccion
  const addr = server.address();

  // Y envia un log informando que se ejecuto
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  Logger.info(`Listening on ${bind}`);
});
