import { beforeEach, describe, expect, it } from '@jest/globals';
import {
  createCacheDecorator,
  defaultGenerateKey,
  CreateCacheDecoratorOptions,
} from '../src/index';

describe('defaultGenerateKey', () => {
  it('should generate the correct cache key', () => {
    const className = 'TestClass';
    const methodName = 'testMethod';
    const args = [1, 'arg2', { key: 'value' }];

    const expectedKey = 'TestClass#testMethod([1,"arg2",{"key":"value"}])';
    const actualKey = defaultGenerateKey(className, methodName, args);

    expect(actualKey).toBe(expectedKey);
  });
});

describe('createCacheDecorator', () => {
  let cache: Record<string, unknown>;

  beforeEach(() => {
    cache = {};
  });

  const options: CreateCacheDecoratorOptions<unknown, { ttl: number }> = {
    getItem: async (key) => cache[key],
    setItem: async (key, value) => {
      cache[key] = value;
    },
  };

  const cacheDecorator = createCacheDecorator(options);

  class TestClass {
    @cacheDecorator({ ttl: 3000 })
    async testMethod(arg: string): Promise<string> {
      return `Processed ${arg}`;
    }
  }

  it('should cache the result of the method', async () => {
    const instance = new TestClass();

    const result1 = await instance.testMethod('test');
    expect(result1).toBe('Processed test');
    expect(cache['TestClass#testMethod(["test"])']).toBe('Processed test');

    const result2 = await instance.testMethod('test');
    expect(result2).toBe('Processed test');
    expect(result1).toBe(result2); // Should return cached result
  });

  it('should handle cache miss and store result', async () => {
    const instance = new TestClass();

    const result1 = await instance.testMethod('miss');
    expect(result1).toBe('Processed miss');
    expect(cache['TestClass#testMethod(["miss"])']).toBe('Processed miss');

    // Simulate cache miss
    cache = {};

    const result2 = await instance.testMethod('miss');
    expect(result2).toBe('Processed miss');
    expect(cache['TestClass#testMethod(["miss"])']).toBe('Processed miss');
  });

  it('should work with custom generateKey function', async () => {
    const customOptions: CreateCacheDecoratorOptions<unknown, { ttl: number }> =
      {
        ...options,
        generateKey: (className, methodName, args) =>
          `${className}-${methodName}-${args.join('-')}`,
      };

    const customCacheDecorator = createCacheDecorator(customOptions);

    class CustomTestClass {
      @customCacheDecorator({ ttl: 3000 })
      async customMethod(arg: string): Promise<string> {
        return `Custom Processed ${arg}`;
      }
    }

    const instance = new CustomTestClass();

    const result1 = await instance.customMethod('custom');
    expect(result1).toBe('Custom Processed custom');
    expect(cache).toHaveProperty('CustomTestClass-customMethod-custom');

    const result2 = await instance.customMethod('custom');
    expect(result2).toBe('Custom Processed custom');
    expect(result1).toBe(result2); // Should return cached result
  });
});
