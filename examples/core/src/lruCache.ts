import { createCacheDecorator } from '@cache-decorator/core';
import { delay } from './utils';

const TTLCache = require('@isaacs/ttlcache');
const cache = new TTLCache({ max: 10000, ttl: 1000 });

const ttlCacheDecorator = createCacheDecorator({
  getItem: async (key) => {
    return cache.get(key);
  },
  setItem: async (key, value, { ttl }: { ttl: number }) => {
    cache.set(key, value, { ttl });
  },
});

console.log(ttlCacheDecorator);

class ExpensiveOperations {
  @ttlCacheDecorator({
    ttl: 3000,
  })
  async heavyComputation(arg1: number, arg2: number) {
    console.log('Heavy computation', arg1, arg2);
    await delay(2000);
  }
}

export const lruCacheExample = async () => {
  console.log('=== LRU Cache example ===');
  const operationsWithExpiry = new ExpensiveOperations();
  const start1 = Date.now();
  console.log(await operationsWithExpiry.heavyComputation(2, 3)); // Performs computation
  const end1 = Date.now();
  console.log(
    `1st call -> executing operation. Total time: ${end1 - start1}ms`
  );

  const start2 = Date.now();
  console.log(await operationsWithExpiry.heavyComputation(2, 3)); // Returns cached result
  const end2 = Date.now();
  console.log(
    `2nd call -> returning cached result. Total time: ${end2 - start2}ms`
  );
  console.log('Waiting until cache expires');

  await delay(3001);
  const start3 = Date.now();
  console.log(await operationsWithExpiry.heavyComputation(2, 3)); // Cache expired, performs computation again
  const end3 = Date.now();
  console.log(`3rd call -> executing operation. Total time: ${end3 - start3}`);
};
