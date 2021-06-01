import fs from 'fs'
import { dirsToCheck } from '../files.js'
import chalk from 'chalk'
import readline from 'readline'

const b = chalk.bold
const warning = chalk.yellow

const findMissingDirs = () => dirsToCheck.filter((dir) => !fs.existsSync(dir))

const warnUser = (dirs) => {
  console.log(warning(`⚠️ ${b('Warning')}: It seems your project is missing the following sub-directories`))
  dirs.forEach((dir) => console.log(warning('•', dir)))
}

const getPermission = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  function question(query) {
    return new Promise(resolve => {
        rl.question(query, resolve)
    })
  }

  const answer = await question(warning('Are you sure you want to proceed? (y/n) '))
  rl.close()
  return answer.toLowerCase()
}

export { findMissingDirs , warnUser, getPermission }