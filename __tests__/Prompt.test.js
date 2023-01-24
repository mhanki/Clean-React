import dir from '../__mocks__/directory.js';
import readline from 'readline';
import { Prompt } from '../src/Prompt.ts';

const UserPrompt = new Prompt();
const consoleSpy = jest.spyOn(console, 'log');

jest.mock('fs');
jest.mock('readline');

afterEach(() => {
  dir.reset();
  consoleSpy.mockClear();
});

describe('Prompt.message', () => {
  it('prints a custom message', () => {
    const message = 'Hello there';

    UserPrompt.message([message]);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(message));
  });

  it('prints multiple messages at once', () => {
    const messages = ['Hello there', 'How are you doing today?'];

    UserPrompt.message(messages);

    expect(consoleSpy).toBeCalledTimes(messages.length + 1); // adds empty line print
  });
})

describe('Prompt.permission', () => {
  it("returns true if user answers with 'y'", async () => {
    readline.createInterface().question
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('y'), 100));

    const permission = await UserPrompt.permission('Permission granted?');

    expect(permission).toBe(true);
  })

  it("returns false if user answers anything else", async () => {
    readline.createInterface().question
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('n'), 100));
    
    let permission = await UserPrompt.permission('Permission granted?');
    
    expect(permission).toBe(false);

    readline.createInterface().question
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('gibberish'), 100));

    permission = await UserPrompt.permission('Permission granted?');
    expect(permission).toBe(false);
  })
})