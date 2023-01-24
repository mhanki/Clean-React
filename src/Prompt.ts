import chalk from 'chalk';
import readline from 'readline';

enum MessageType {
  INFO = 'cyan',
  WARNING = 'yellow'
};

export class Prompt {
  message = (messages: string[], type: keyof typeof MessageType = 'INFO'): void => {
    const color = MessageType[type];
    messages.forEach( message => console.log(chalk[color](message)) )
    console.log('')
  };

  permission = async (message: string, type: keyof typeof MessageType = 'INFO'): Promise<boolean> => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    function question(query: string) {
      return new Promise<string>(resolve => {
          rl.question(query, resolve)
      })
    };
  
    const color = MessageType[type];
    const answer = await question(chalk[color](`${message} (y/n) `));
    const permission = answer.toLowerCase() == 'y';

    rl.close();
    console.log('');

    return permission;
  }
}