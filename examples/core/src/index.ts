import { lruCacheExample } from './lruCache';
import { redisExample } from './redis';

(async () => {
  await lruCacheExample();
  await redisExample();
})();
