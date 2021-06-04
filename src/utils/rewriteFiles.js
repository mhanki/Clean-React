import { writeFile } from 'fs/promises'

const rewriteOne = (path, data) => writeFile(path, data)

const rewriteAll = (files) => {
  try{
    let promises = Object.keys(files).map((key) => rewriteOne(key, files[key].newContent))
    return promises
  } catch(err){
    console.log(err)
  }
}

export { rewriteOne , rewriteAll }