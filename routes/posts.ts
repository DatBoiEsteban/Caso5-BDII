import * as express from 'express';
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

// Exporta la aplicacion
export default app;


const formatHashes = async (inicio: number, final: number) => {

  // De lo contrario, obtiene todos los hashtags
  const hashtags = await getHashtags();

  // Obtiene el tamaño de cada grupo
  const groupSize = Math.floor(hashtags.length / 10);
  
  // Obtiene el gropo de hashtags que se solicito
  const group = hashtags.slice(
    (inicio - 1) * groupSize,
    (final - 1) * groupSize
  );

  // Obtiene todos los hashtags del grupo
  return group.map((x) => x.key);
}