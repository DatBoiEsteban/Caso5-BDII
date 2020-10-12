import * as express from 'express';
import * as bodyParser from 'body-parser';
import Routes from './routes/routes';
import configureDbs from "./databases";

class App {
  public express: express.Application;
  users: any[];

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    configureDbs(this.express);
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
