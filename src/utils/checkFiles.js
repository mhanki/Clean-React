import { findModifiedFiles } from './searchDirectory.js'
import { readdir } from 'fs/promises'
import path from 'path'

const _filter = (files, filter) => Object.fromEntries(
  Object.entries(files).filter(
    ([path]) => Array.isArray(filter) ? !filter.includes(path) : !filter.hasOwnProperty(path)
  )
)

const checkFiletype = async (files) => {
  const dir = await readdir('src')
  const filteredDir = dir.filter(file => path.extname(file).match(/\.[tj]sx?$/))
  const extension = path.extname(filteredDir[0])

  if(extension == '.js'){ return files}

  const filteredFiles = Object.entries(files)
    .filter(([filepath, content]) => filepath.split('/')[0] == 'src')
    .map(([filepath, content]) => {
      filepath = path.extname(filepath).match(/\.[tj]sx?$/) 
        ? filepath.split(path.extname(filepath))[0] + extension 
        : filepath

      return [filepath, content]
    })

  const rest = Object.entries(files).filter((file) => file[0].split('/')[0] != 'src')

  return Object.fromEntries([...rest, ...filteredFiles])
}

const checkFiles = (files) => {
  const modifiedPaths = findModifiedFiles(files)
  const unmodifiedFiles = _filter(files, modifiedPaths)
  const modifiedFiles = _filter(files, unmodifiedFiles)

  return [unmodifiedFiles, [modifiedPaths, modifiedFiles]]
}

export { checkFiles, checkFiletype }