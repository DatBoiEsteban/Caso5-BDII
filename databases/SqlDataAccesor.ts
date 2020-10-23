import { IDataAccessor } from './index';
import { Application } from 'express';
import Post from '../mongo/schemas';
import mongoConnect from '../mongo/database';
import mongoData from '../mongo/data';
import sqlConnect from '../sqlserver/database';
import logger from '../logger/logger';
import { Connection, Request } from 'tedious';

export class SqlDataAccesor implements IDataAccessor {
  constructor(private app: Application) {}

  async getData(hashtags: string[]): Promise<any[]> {
    const hashtagsString = "'" + hashtags.join("','") + "'";
    const posts: any[] = [];
    return new Promise((res) => {
      const sql = this.app.get('sql') as Connection;
      // Ejecuta el query

      const request = new Request(
        `SELECT H.Hashtag, A.Titulo, A.Autor
        FROM Hashtags H
          INNER JOIN Articulo_Hashtags AH ON AH.HashtagId = H.Id
          INNER JOIN Articulos A ON A.Id = AH.ArticuloId
        WHERE Hashtag IN (${hashtagsString})`,
        (err, _) => {
          if (err) logger.error(err);
        }
      );

      request.on('row', (columns) => {
        posts.push({ autor: columns[2].value, titulo: columns[1].value });
      });

      request.on('doneProc', (_, asdf, rows) => {
        logger.info(rows);
        res(posts);
      });

      sql.execSql(request);
    });
  }
}
