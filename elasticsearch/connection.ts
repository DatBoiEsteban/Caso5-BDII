import { Client } from '@elastic/elasticsearch';
import logger from '../logger/logger';

const es = new Client({ node: 'http://localhost:9200' });

const getHashtags = (): void => {
  es.search({
    index: 'videos',
    body: {
      aggs: {
        duplicate_aggs: {
          terms: {
            field: 'description.keyword',
            min_doc_count: 2,
          },
        },
        duplicate_bucketcount: {
          stats_bucket: {
            buckets_path: 'duplicate_aggs._count',
          },
        },
        nonduplicate_aggs: {
          terms: {
            field: 'description.keyword',
          },
          aggs: {
            equal_one: {
              bucket_selector: {
                buckets_path: {
                  count: '_count',
                },
                script: 'params.count == 1',
              },
            },
          },
        },
        nonduplicate_bucketcount: {
          sum_bucket: {
            buckets_path: 'nonduplicate_aggs._count',
          },
        },
      },
    },
  }).then(
    (res) => logger.info(JSON.stringify(res.body.aggregations, null, 4)),
    (err) => logger.error(err)
  );
};

export { getHashtags };
