import { writeFile } from 'fs/promises'
import { warnUser, getPermission } from './userPrompts.js'

const rewriteOne = (path, data) => writeFile(path, data)

const rewriteAll = (files) => {
  try{
    let promises = Object.keys(files).map((key) => rewriteOne(key, files[key].newContent))
    return promises
  } catch(err){
    console.log(err)
  }
}

const rewriteWithPermission = async (files) => {
  let promises = []

  for(let [path, content] of Object.entries(files)){
    warnUser([path], "The following file seems to have been modified before", false)
    let permission = await getPermission("Are you sure you want to overwrite it?")
    if(permission){ promises.push(rewriteOne(path, content.newContent)) }
  }

  return promises
}

export { rewriteOne , rewriteAll, rewriteWithPermission }