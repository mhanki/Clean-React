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

const rewriteWithPermission = (files) => Object.entries(files).map(async ([path, content]) => {
  warnUser([path], "The following file seems to have been modified already")
  let permission = await getPermission("Are you sure you want to overwrite it?")
  if(permission){ return rewriteOne(path, content.newContent) }
})

export { rewriteOne , rewriteAll, rewriteWithPermission }