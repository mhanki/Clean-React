import { writeFile } from 'fs/promises'

const rewriteFile = (path, data) => writeFile(path, data)

const rewriteFiles = async (files) => {
  try{
    let promises = Object.keys(files).map((key) => rewriteFile(key, files[key].newContent))
    return Promise.all(promises)
  } catch(err){
    console.log(err)
  }
}

export { rewriteFile , rewriteFiles }