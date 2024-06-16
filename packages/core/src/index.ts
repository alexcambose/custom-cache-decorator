/**
 * Default function to generate cache keys.
 * Constructs a string key based on class name, method name, and method arguments.
 *
 * @param {string} className - The name of the class.
 * @param {string} methodName - The name of the method.
 * @param {unknown[]} args - The arguments passed to the method.
 * @returns {string} The generated cache key.
 */
const defaultGenerateKey = (
  className: string,
  methodName: string,
  args: unknown[]
): string => {
  return `${className}#${methodName}(${JSON.stringify(args)})`;
};

/**
 * Options for creating a cache decorator.
 *
 * @template T - The type of the cached value.
 * @template O - The type of the options passed to the decorator.
 */
export type CreateCacheDecoratorOptions<T, O> = {
  /**
   * Function to retrieve an item from the cache.
   *
   * @param {string} key - The cache key.
   * @returns {Promise<T>} A promise that resolves to the cached value.
   */
  getItem: (key: string) => Promise<T>;

  /**
   * Function to store an item in the cache.
   *
   * @param {string} key - The cache key.
   * @param {T} value - The value to store.
   * @param {O} options - Additional options for storing the item.
   * @returns {Promise<void>} A promise that resolves when the item is stored.
   */
  setItem: (key: string, value: T, options: O) => Promise<void>;

  /**
   * Optional function to generate cache keys.
   * If not provided, `defaultGenerateKey` will be used.
   *
   * @param {string} className - The name of the class.
   * @param {string} methodName - The name of the method.
   * @param {unknown[]} args - The arguments passed to the method.
   * @returns {string} The generated cache key.
   */
  generateKey?: (
    className: string,
    methodName: string,
    args: unknown[]
  ) => string;
};

/**
 * Factory function to create a cache decorator.
 *
 * @template T - The type of the cached value.
 * @template O - The type of the options passed to the decorator.
 * @param {CreateCacheDecoratorOptions<T, O>} options - Options for the cache decorator.
 * @returns {(decoratorArgs: O) => MethodDecorator} A cache decorator function.
 */
export const createCacheDecorator = <T, O>(
  options: CreateCacheDecoratorOptions<T, O>
) => {
  /**
   * Cache decorator function.
   *
   * @param {O} decoratorArgs - Arguments for the cache decorator.
   * @returns {MethodDecorator} A method decorator that caches the method result.
   */
  return (decoratorArgs: O): MethodDecorator => {
    return function cache(
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: unknown[]) {
        const cacheKey = (options.generateKey || defaultGenerateKey)(
          this.constructor.name,
          propertyKey,
          args
        );
        const cachedResult = await options.getItem(cacheKey);

        if (cachedResult !== undefined) {
          return cachedResult;
        } else {
          const result = await originalMethod.apply(this, args);
          await options.setItem(cacheKey, result, decoratorArgs);
          return result;
        }
      };

      return descriptor;
    };
  };
};
