import { Application } from 'express';
import { Connection } from 'tedious';
import Logger from '../logger/logger';

/** Exporta la conexion */
export default (app: Application) => {
  return new Promise((res, rej) => {
    /** Establece una nueva conexion con Sql Server */
    const connection = new Connection({
      server: '.',
      authentication: {
        type: 'default',
        options: {
          userName: 'caso5admin',
          password: 'test',
        },
      },
    });

    // const connection = new Connection({
    //   server: 'localhost',
    //   authentication: {
    //     type: 'default',
    //     options: {
    //       userName: 'sa',
    //       password: 'reallyStrongPassword123',
    //     },
    //   },
    //   options: {
    //     database: 'caso5',
    //     encrypt: false,
    //   },
    // });

    /** Listener cuando se conecta a la base de datos */
    connection.on('connect', (err) => {
      if (err) {
        Logger.error('Algo salió mal con Sql Server (Tedious)');
        rej(err);
      } else {
        Logger.info('Conectado a la base de datos de Sql Server');
        app.set('sql', connection);
        res();
      }
    });
  });
};
