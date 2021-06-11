import fs from 'fs'

const findMissingDirs = (dirs) => dirs.filter((dir) => !fs.existsSync(dir))

const findModifiedFiles = (files) => {
  const _isRemoved = (path) => !fs.existsSync(path)
  const _isModified = (path, content) => {
    if(Array.isArray(content)){
      for(let entry of content){
        if(fs.readFileSync(path) == entry){ return false }
      }
      return true
    }
    
    return fs.readFileSync(path) != content
  }

  return Object.keys(files).filter((path) => _isRemoved(path) || _isModified(path, files[path].oldContent))
}

export { findMissingDirs, findModifiedFiles }