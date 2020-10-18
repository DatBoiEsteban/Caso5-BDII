import { Client } from '@elastic/elasticsearch';

// Se conecta con Elastic Search
const es = new Client({ node: 'http://localhost:9200' });

/** Funcion para obtener todos los hashtags */
export const getHashtags = async (): Promise<any[]> => {
  // Ejecuta la peticion a elastic
  const result = await es.search({
    index: 'videos',
    body: {
      aggs: {
        duplicate_aggs: {
          terms: {
            field: 'description.keyword',
            min_doc_count: 1,
            size: 100,
          },
        },
      },
    },
  });

  // Y retorna los resultados
  return result.body.aggregations.duplicate_aggs.buckets;
};
