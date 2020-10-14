import * as express from 'express';
import Logger from '../logger/logger';
import { getHashtags } from '../elasticsearch/connection';

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

  Logger.info(tamanodegrupo);
  res.json(hashtagsparaenviar);
});

export default app;
