import * as express from 'express';
import { Connection, Request } from 'tedious';
import { IDataAccessor } from '../databases';
import { getHashtags } from '../elasticsearch/connection';
import logger from '../logger/logger';
import Post from '../mongo/schemas';
import Redis from '../redis';

// Crea un app de express
const app = express();

// Ruta para obtener los posts desde mongo
app.get('/:inicio/:final', async (req, res) => {
  // Obtiene los grupos que se solicitaron
  const inicio = +req.params.inicio;
  const final = +req.params.final;

  // Revisa si hay alguna respuesta en el cache
  const redisCachedResponse = await Redis.get(`posts-${inicio}-${final}:`);

  // Si la hay, la envia al usuario
  if (redisCachedResponse) return res.json(JSON.parse(redisCachedResponse));

  // Limpia los hasheas
  const hashtags = await formatHashes(inicio, final);

  // Obtiene los posts que tenga esos hashtags
  const data = await (req.app.get('data') as IDataAccessor).getData(hashtags);

  // Guarda en redis
  await Redis.set(`posts-${inicio}-${final}:`, JSON.stringify(data));
  // Ejecuta el query
  return res.json(data);
});

// Exporta la aplicacion
export default app;

const formatHashes = async (inicio: number, final: number) => {
  // De lo contrario, obtiene todos los hashtags
  const hashtags = await getHashtags(inicio, final);

  // Obtiene todos los hashtags del grupo
  return hashtags.map((x) => x.key);
};
