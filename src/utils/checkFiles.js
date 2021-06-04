import { findModifiedFiles } from './searchDirectory.js'

const _filter = (files, filter) => Object.fromEntries(
  Object.entries(files).filter(
    ([path]) => Array.isArray(filter) ? !filter.includes(path) : !filter.hasOwnProperty(path)
  )
)

const checkFiles = (files) => {
  const modifiedPaths = findModifiedFiles(files)
  const unmodifiedFiles = _filter(files, modifiedPaths)
  const modifiedFiles = _filter(files, unmodifiedFiles)

  return [unmodifiedFiles, [modifiedPaths, modifiedFiles]]
}

export { checkFiles }