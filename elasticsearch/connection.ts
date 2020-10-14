import { Client } from '@elastic/elasticsearch';
import logger from '../logger/logger';

const es = new Client({ node: 'http://localhost:9200' });

const getHashtags = async (): Promise<any[]> => {
  const result = await es.search({
    index: 'videos',
    body: {
      aggs: {
        duplicate_aggs: {
          terms: {
            field: 'description.keyword',
            min_doc_count: 1,
            size: 2000,
          },
        },
      },
    },
  });
  return result.body.aggregations.duplicate_aggs.buckets;
};

export { getHashtags };
