import dir from '../__mocks__/directory.js';
import chalk from 'chalk';
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

  /* it('prints a message in custom colors', () => {
    jest.mock('chalk', () => ({
      green: jest.fn(),
      yellow: jest.fn(),
    }));

    UserPrompt.message(['Warning'], 'WARNING');

    expect(chalk.yellow).toBeCalledTimes(1);
  }); */
})

describe('Prompt.permission', () => {
  it("returns true if user answers with 'y'", async () => {
    let permission = await UserPrompt.permission('Permission granted?');

    expect(permission).toBe(true); // mock input 'y
  })

  it("returns false if user answers anything else", async () => {
    let permission = await UserPrompt.permission('Permission granted?');
    expect(permission).toBe(false); // mock input 'n'

    permission = await UserPrompt.permission('Permission granted?');
    expect(permission).toBe(false); // mock input 'gibberish'
  })
})