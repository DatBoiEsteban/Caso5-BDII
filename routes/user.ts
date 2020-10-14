import * as express from 'express';
import Logger from '../logger/logger';
import { getHashtags } from '../elasticsearch/connection';
import Post from '../mongo/schemas';

const app = express();

app.get('/:inicio/:final', async (req, res) => {
  const inicio = +req.params.inicio;
  const final = +req.params.final;
  const hashtags = await getHashtags();

  const tamanodegrupo = Math.floor(hashtags.length / 10);
  const hashtagsparaenviar = hashtags.slice(
    (inicio - 1) * tamanodegrupo,
    (final - 1) * tamanodegrupo
  );
  const datosLimpios = hashtagsparaenviar.map((x) => x.key);
  const articulos = await Post.find();
  res.json(articulos);
});

export default app;
