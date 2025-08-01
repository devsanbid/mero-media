import { jest } from '@jest/globals';

process.env.NODE_ENV = 'test';

beforeAll(() => {
  jest.setTimeout(30000);
});

afterAll(() => {
  if (global.testDb) {
    global.testDb.close();
  }
});

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};