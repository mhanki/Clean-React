import { dirsToCheck } from './files.js'
import { findMissingDirs } from './utils/checks.js'
import { getPermission, warnUser } from './utils/userPrompts.js'

const checkDirectory = async () => {
  const missing = findMissingDirs(dirsToCheck)

  if(missing.length == 0){
    return true
  }

  warnUser(missing, "It seems your project is missing the following sub-directories")

  return await getPermission("Are you sure you want to proceed?")
}

export default checkDirectory