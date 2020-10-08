import * as express from 'express';
import * as bodyParser from 'body-parser';
import connect from "./databases"
import Routes from './routes/routes';
import connection from './databases/sqlserver';

class App {
  public express: express.Application;
  users: any[];

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    connect(this.express);
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    }

  private routes(): void {
    this.express.get('/', (req, res, next) => {
      res.send('Typescript App works!!!');
    });

    this.express.use('/api', Routes);

    this.express.use('*', (req, res, next) => {
      res.send('Make sure url is correct!!!');
    });
  }
}

export default new App().express;
