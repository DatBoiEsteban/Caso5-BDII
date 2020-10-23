import { MongoDataAccesor } from './databases/index';
import { SqlDataAccesor } from './databases/SqlDataAccesor';
import * as express from 'express';
import routes from './routes';
import configureDbs from './databases';

/** Clase para crear el servidor de express */
class App {
  /** Servidor de express */
  public express: express.Application;

  /** Constructor */
  constructor() {
    // Crea la aplicacion de express
    this.express = express();

    // Activa los middlewares del pipeline
    this.middleware();

    // Configura las rutas
    this.routes();

    // Configura el data accesor
    // this.express.set('data', new SqlDataAccesor(this.express));
    this.express.set('data', new MongoDataAccesor());

    // Configura las bases de datos
    configureDbs(this.express);
  }

  /** Metodo para configurar los middlewars */
  private middleware() {
    // Configura los middlewares para leer el json desde el cuerpo
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
  }

  /** Metedo para configurar las rutas */
  private routes() {
    // Ruta inicial donde se muestran todas las urls
    this.express.get('/', (req, res, next) => {
      res.send('Caso 5');
    });

    // Configura las rutas de api
    routes(this.express);

    // Y una ruta fallback
    this.express.use('*', (req, res, next) => {
      res.send('Make sure url is correct!!!');
    });
  }
}

// Exporta el servidor
export default new App().express;
