import * as express from 'express';
import { Connection, Request } from 'tedious';
import { IDataAccessor } from '../databases';
import { getHashtags } from '../elasticsearch/connection';
import Post from '../mongo/schemas';
import Redis from "../redis";


// Crea un app de express
const app = express();

// Ruta para obtener los posts desde mongo
app.get('/mongo/:inicio/:final', async (req, res) => {

  // Obtiene los grupos que se solicitaron
  const inicio = +req.params.inicio;
  const final = +req.params.final;

  // Revisa si hay alguna respuesta en el cache
  const redisCachedResponse = await Redis.get(`mongo-posts-${inicio}-${final}:`);

  // Si la hay, la envia al usuario
  if (redisCachedResponse)
    return res.json(redisCachedResponse);

  // Limpia los hasheas
  const rawHashtags = await formatHashes(inicio, final);
  
  // Obtiene los posts que tenga esos hashtags
  const posts = await Post.find({
    hashes: {
      $in: rawHashtags
    }
  });

  // Y los envia al usuario
  return res.json(posts);
});

// Ruta para obtener los posts desde mongo
app.get('/sql/:inicio/:final', async (req, res) => {

  // Obtiene los grupos que se solicitaron
  const inicio = +req.params.inicio;
  const final = +req.params.final;

  // Revisa si hay alguna respuesta en el cache
  const redisCachedResponse = await Redis.get(`mongo-posts-${inicio}-${final}:`);

  // Si la hay, la envia al usuario
  if (redisCachedResponse)
    return res.json(redisCachedResponse);

  // Limpia los hasheas
  const rawHashtags = await formatHashes(inicio, final);
  const hashtags = "'" + rawHashtags.join("','") + "'";
  
  // Obtiene los posts que tenga esos hashtags
  const sql = req.app.get("sql") as Connection;

  // Ejecuta el query
  sql.execSql(new Request(`
    SELECT H.Hashtag, A.Titulo, A.Autor FROM Hashtags H
    INNER JOIN Articulo_Hashtags AH ON AH.HashtagId = H.Id
    INNER JOIN Articulos A ON A.Id = AH.ArticuloId
    WHERE Hashtag IN (${hashtags})
  `, 
    (err, _, rows) => 
      res.json({ posts: rows, err })));
  
});

// Ruta para obtener los posts desde mongo
app.get('/:inicio/:final', async (req, res) => {

  // Obtiene los grupos que se solicitaron
  const inicio = +req.params.inicio;
  const final = +req.params.final;

  // Revisa si hay alguna respuesta en el cache
  const redisCachedResponse = await Redis.get(`posts-${inicio}-${final}:`);

  // Si la hay, la envia al usuario
  if (redisCachedResponse)
    return res.json(redisCachedResponse);

  // Limpia los hasheas
  const hashtags = await formatHashes(inicio, final);
  
  // Obtiene los posts que tenga esos hashtags
  const data = req.app.get("data") as IDataAccessor;

  // Ejecuta el query
  return res.json(await data.getData(hashtags));
})


// Exporta la aplicacion
export default app;


const formatHashes = async (inicio: number, final: number) => {

  // De lo contrario, obtiene todos los hashtags
  const hashtags = await getHashtags(inicio, final);

  // Obtiene todos los hashtags del grupo
  return hashtags;
}