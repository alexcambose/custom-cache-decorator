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
      await client.set(key, JSON.stringify(value || null), {
        EX: Math.floor(ttl / 1000), // ttl in seconds
        NX: true,
      });
    },
  });
  class ExpensiveOperations {
    @redisCacheDecorator({
      ttl: 3000,
    })
    async heavyComputation(arg1: number, arg2: number) {
      await delay(2000);
      const res = arg1 + arg2;
      console.log('Heavy computation', arg1, arg2, res);

      return res;
    }
  }

  console.log('=== Redis example ===');
  const operationsWithExpiry = new ExpensiveOperations();
  const start1 = Date.now();
  const res1 = await operationsWithExpiry.heavyComputation(2, 3); // Performs computation
  const end1 = Date.now();
  console.log(
    `1st call -> executing operation. Result is ${res1}. Total time: ${
      end1 - start1
    }ms`
  );

  const start2 = Date.now();

  const res2 = await operationsWithExpiry.heavyComputation(2, 3);
  const end2 = Date.now();
  console.log(
    `2nd call -> returning cached result. Result is ${res2}. Total time: ${
      end2 - start2
    }ms`
  );
  console.log('Waiting until cache expires');
  await delay(3001);
  const start3 = Date.now();
  const res3 = await operationsWithExpiry.heavyComputation(2, 3); // Cache expired, performs computation again
  const end3 = Date.now();
  console.log(
    `3rd call -> executing operation. Result is ${res3}. Total time: ${
      end3 - start3
    }ms`
  );

  await client.disconnect();
};
