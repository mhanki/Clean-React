import { getPermission, findMissingDirs, warnUser } from './utils/userPrompts.js'

const checkDirectory = () => {
  const missing = findMissingDirs()

  if(missing.length == 0){
    return
  }

  warnUser(missing)
  
  return getPermission() == 'y'
    ? 'proceeding'
    : 'exiting'
}

export { checkDirectory }