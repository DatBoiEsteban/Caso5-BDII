import { Application } from 'express';
import Post from "../mongo/schemas";
import mongoConnect from '../mongo/database';
import mongoData from '../mongo/data';
import sqlConnect from '../sqlserver/database';
import logger from '../logger/logger';
import { Connection, Request } from 'tedious';


export interface IDataAccessor {
  getData(hashtags: string[]): Promise<any[]>;
}

export class MongoDataAccesor implements IDataAccessor {
  async getData(hashtags: string[]): Promise<any[]> {
    return await Post.find({
      hashes: {
        $in: hashtags
      }
    });
  }
}

export class SqlDataAccesor implements IDataAccessor {

  constructor(private app: Application) { }

  async getData(hashtags: string[]): Promise<any[]> {

    const hashtagsString = "'" + hashtags.join("','") + "'";

    return new Promise((res) => {
      const sql = this.app.get("sql") as Connection;
  
      // Ejecuta el query
      sql.execSql(new Request(`
        SELECT H.Hashtag, A.Titulo, A.Autor 
        FROM Hashtags H
          INNER JOIN Articulo_Hashtags AH ON AH.HashtagId = H.Id
          INNER JOIN Articulos A ON A.Id = AH.ArticuloId
        WHERE Hashtag IN (${hashtagsString})
    `,
        (err, _, rows) => res(rows)))
    })
  }
}

/** Metodo para configurar las bases de datos de Sql Server y Mongo */
export default (app: Application) => {
  // Se conecta y genera la informacion de pruebas para Mongo
  mongoConnect(app)
    .then(() => mongoData())
    .catch((err) => logger.error('No se pudo conectar con MongoDB', err));

  // Se conecta y genera la informacion de pruebas para Sql Server
  sqlConnect(app).catch((err) =>
    logger.error('No se pudo conectar a la base de datos de Sql Server', err)
  );
};
