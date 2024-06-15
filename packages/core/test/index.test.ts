import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { corePrint } from '@cache-decorator/core';

afterEach(() => {
  jest.clearAllMocks();
});

describe('corePrint', () => {
  it('Check to see if the log outputs correctly.', () => {
    const spyConsoleLog = jest.spyOn(console, 'log').mockReturnValue();

    corePrint();

    expect(spyConsoleLog).toHaveBeenCalledTimes(1);
    expect(spyConsoleLog).toHaveBeenCalledWith('core');
  });
});
