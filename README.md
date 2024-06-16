# Cache Decorator

A TypeScript library providing a customizable cache decorator for methods. This library allows you to easily cache method results with configurable caching mechanisms.

## Installation

Install the library via npm:

```
npm install custom-cache-decorator
```

or yarn

```
yarn add custom-cache-decorator
```

## Usage

### Basic Usage

Here's a basic example of how to use the cache decorator in your TypeScript project.

#### 1. Import the Library

```ts
import { createCacheDecorator } from 'custom-cache-decorator';
```

#### 2. Define Your Cache Decorator

Create a cache decorator with custom `getItem` and `setItem` functions:

```ts
import { createCacheDecorator } from 'custom-cache-decorator';

const inMemoryCache = new Map<string, any>();

const cacheDecorator = createCacheDecorator({
  getItem: async (key) => inMemoryCache.get(key),
  setItem: async (key, value) => inMemoryCache.set(key, value),
});
```

#### 3. Apply the Cache Decorator

Use the created cache decorator on your methods:

```ts
class ExpensiveOperations {
  @cacheDecorator({ ttl: 3000 })
  async heavyComputation(arg1: number, arg2: number): Promise<number> {
    console.log('Performing heavy computation...');
    // Simulate heavy computation
    return new Promise((resolve) =>
      setTimeout(() => resolve(arg1 * arg2), 1000)
    );
  }
}
```

#### 4. Use Your Class

```ts
(async () => {
  const operations = new ExpensiveOperations();

  console.log(await operations.heavyComputation(2, 3)); // Performs computation
  console.log(await operations.heavyComputation(2, 3)); // Uses cached result
})();
```

### Using with Redis

Here's an example of using the cache decorator with Redis as the caching backend.

```ts
import { createCacheDecorator } from 'custom-cache-decorator';
import { createClient } from 'redis';

(async () => {
  const client = createClient();
  await client.connect();

  const redisCacheDecorator = createCacheDecorator({
    getItem: async (key) => {
      const value = await client.get(key);
      return value ? JSON.parse(value) : undefined;
    },
    setItem: async (key, value, { ttl }: { ttl: number }) => {
      await client.setEx(key, ttl, JSON.stringify(value));
    },
  });

  class ExpensiveOperations {
    @redisCacheDecorator({ ttl: 60 })
    async heavyComputation(arg1: number, arg2: number): Promise<number> {
      console.log('Performing heavy computation...');
      // Simulate heavy computation
      return new Promise((resolve) =>
        setTimeout(() => resolve(arg1 * arg2), 1000)
      );
    }
  }

  const operations = new ExpensiveOperations();

  console.log(await operations.heavyComputation(2, 3)); // Performs computation
  console.log(await operations.heavyComputation(2, 3)); // Uses cached result

  await client.disconnect();
})();
```

## API

### `createCacheDecorator(options: CreateCacheDecoratorOptions<T, O>): (decoratorArgs: O) => MethodDecorator`

Creates a cache decorator.

#### Parameters

- `options`: Configuration options for the cache decorator.
  - `getItem`: Function to retrieve an item from the cache.
  - `setItem`: Function to store an item in the cache.
  - `generateKey` (optional): Custom function to generate cache keys. Defaults to `defaultGenerateKey`.

#### Returns

A cache decorator function to be applied to class methods.

### `defaultGenerateKey(className: string, methodName: string, args: unknown[]): string`

Default function to generate cache keys.

#### Parameters

- `className`: The name of the class.
- `methodName`: The name of the method.
- `args`: The arguments passed to the method.

#### Returns

A string representing the cache key.

### Advanced Example with Custom Key Generation

You can customize the cache key generation with the `generateKey` arg.

```ts
import {
  createCacheDecorator,
  defaultGenerateKey,
} from 'custom-cache-decorator';

const customKeyDecorator = createCacheDecorator({
  getItem: async (key) => inMemoryCache.get(key),
  setItem: async (key, value) => inMemoryCache.set(key, value),
  generateKey: (className, methodName, args) =>
    `${className}_${methodName}_${args.join('_')}`,
});

class ExpensiveOperations {
  @customKeyDecorator({})
  async heavyComputation(arg1: number, arg2: number): Promise<number> {
    console.log('Performing heavy computation...');
    return new Promise((resolve) =>
      setTimeout(() => resolve(arg1 * arg2), 1000)
    );
  }
}
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

:star:
