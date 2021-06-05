import chalk from 'chalk'
import readline from 'readline'

const b = chalk.bold
const types = {
  info: chalk.green,
  warning: chalk.yellow
}

const printMessage = (messages, type) => {
  messages.forEach(message => console.log(types[type](message)))
}

const warnUser = (paths, message, sign = true) => {
  const warningSign = `⚠️ ${b('Warning')}:`
  const printMessage = sign ? `${warningSign} ${message}` : message
  console.log('')
  console.log(types.warning(printMessage))
  paths.forEach((path) => console.log(types.warning('•', path)))
  console.log('')
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

  const answer = await question(`${message} (y/n) `)
  rl.close()
  return answer.toLowerCase() == 'y'
}

export { warnUser, getPermission, printMessage }