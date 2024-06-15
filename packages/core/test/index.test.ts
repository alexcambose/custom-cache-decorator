import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { corePrint } from '@typescript-library-template/core';
import { modulePrint } from '@typescript-library-template/core/module';

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

describe('modulePrint', () => {
  it('Check to see if the log outputs correctly.', () => {
    const spyConsoleLog = jest.spyOn(console, 'log').mockReturnValue();

    modulePrint();

    expect(spyConsoleLog).toHaveBeenCalledTimes(1);
    expect(spyConsoleLog).toHaveBeenCalledWith('module');
  });
});
