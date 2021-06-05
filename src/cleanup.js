import { removeAll } from './utils/removeFiles.js'
import { checkFiles } from './utils/checkFiles.js'
import { warnUser, getPermission } from './utils/userPrompts.js'
import { rewriteAll, rewriteWithPermission } from './utils/rewriteFiles.js'

const _getSkipPermission = (paths) => {
  warnUser(paths, "It seems some project files have already been modified")
  return getPermission("Do you want to change them all?")
}

const cleanup = async (filesToRemove, filesToRewrite) => {
  const [unmodifiedFiles, [modifiedPaths, modifiedFiles]] = checkFiles(filesToRewrite)

  const rewriteUnmodified = rewriteAll(unmodifiedFiles)
  removeAll(filesToRemove)
  
  if(modifiedPaths.length == 0){
    return Promise.all(rewriteUnmodified)
  }

  const skipPrompts = await _getSkipPermission(modifiedPaths)
  const rewriteModified = skipPrompts ? rewriteAll(modifiedFiles) : rewriteWithPermission(modifiedFiles)

  return Promise.all([...rewriteModified, ...rewriteUnmodified])
}

export { cleanup }