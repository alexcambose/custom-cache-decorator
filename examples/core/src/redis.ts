import { createCacheDecorator } from '@cache-decorator/core';
import { createClient } from 'redis';
import { delay } from './utils';

export const redisExample = async () => {
  const client = createClient();

  client.on('error', (err: unknown) => console.log('Redis Client Error', err));

  await client.connect();

  const redisCacheDecorator = createCacheDecorator({
    getItem: async (key) => {
      const value = await client.get(key);
      return value ? JSON.parse(value) : undefined;
    },
    setItem: async (key, value, { ttl }: { ttl: number }) => {
      await client.set(key, JSON.stringify(value), {
        EX: ttl / 1000, // ttl in seconds
      });
    },
  });
  class ExpensiveOperations {
    @redisCacheDecorator({
      ttl: 3000,
    })
    async heavyComputation(arg1: number, arg2: number) {
      console.log('Heavy computation', arg1, arg2);
      await delay(2000);
    }
  }

  console.log('=== Redisexample ===');
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
  console.log(
    `3rd call -> executing operation. Total time: ${end3 - start3}ms`
  );

  await client.disconnect();
};
