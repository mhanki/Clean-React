import { getPermission, findMissingDirs, warnUser } from './utils/userPrompts.js'

const checkDirectory = async () => {
  const missing = findMissingDirs()

  if(missing.length == 0){
    return true
  }

  warnUser(missing)

  return await getPermission()  == 'y'
}

export default checkDirectory