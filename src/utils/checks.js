import fs from 'fs'

const findMissingDirs = (dirs) => dirs.filter((dir) => !fs.existsSync(dir))

const getModifiedFiles = (files) => {
  const _isRemoved = (path) => !fs.existsSync(path)
  const _isModified = (path, content) => fs.readFileSync(path) != content

  return Object.keys(files).filter((path) => _isRemoved(path) || _isModified(path, files[path].oldContent))
}

export { findMissingDirs, getModifiedFiles }