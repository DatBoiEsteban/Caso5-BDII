import { Client } from '@elastic/elasticsearch';
import logger from '../logger/logger';

// Se conecta con Elastic Search
const es = new Client({ node: 'http://localhost:9200' });

/** Funcion para obtener todos los hashtags */
export const getHashtags = async (
  inicio: number,
  fin: number
): Promise<any[]> => {
  // Ejecuta la peticion a elastic
  const result = await es.search({
    index: 'videos',
    body: {
      size: 0,
      aggs: {
        hashtags_count: {
          terms: {
            field: 'description.keyword',
            size: 10000,
          },
        },
        stats: {
          stats_bucket: {
            buckets_path: 'hashtags_count._count',
          },
        },
      },
    },
  });

  // Objeto que tiene los stats de min, max y demas de el query anterior
  const stats = result.body.aggregations.stats;

  // numero que nos da la distribuicion de las palabras relativo a las repeticiones
  const modulo = Math.floor((stats.max - stats.min) / 10);

  // Ejecuta el query que devuelve solo las palabras que deben ser utilizadas para las demas busquedas
  const resultverdad = await es.search({
    index: 'videos',
    body: {
      size: 0,
      aggs: {
        hashtags_count: {
          terms: {
            field: 'description.keyword',
            size: 10000,
          },
          aggs: {
            filto: {
              bucket_selector: {
                buckets_path: {
                  total: '_count',
                },
                script: `params.total % ${modulo} >= ${inicio} && params.total % ${modulo} <= ${fin}`,
              },
            },
          },
        },
      },
    },
  });
  // logger.info(resultverdad.body.aggregations.hashtags_count.buckets.length);

  // Y retorna los resultados
  return resultverdad.body.aggregations.hashtags_count.buckets;
};
