import chalk from 'chalk'
import readline from 'readline'

const b = chalk.bold
const warning = chalk.yellow
const info = chalk.green

const printMessage = (messages) => {
  messages.forEach(message => console.log(info(message)))
}

const warnUser = (paths, message) => {
  console.log(warning(`⚠️ ${b('Warning')}: ${message}`))
  paths.forEach((path) => console.log(warning('•', path)))
}

const getPermission = async (message) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  function question(query) {
    return new Promise(resolve => {
        rl.question(query, resolve)
    })
  }

  const answer = await question(warning(`${message} (y/n) `))
  rl.close()
  return answer.toLowerCase() == 'y'
}

export { warnUser, getPermission, printMessage }