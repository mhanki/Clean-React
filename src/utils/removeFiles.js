import fs from 'fs'
import path from 'path'

const removeFile = (filepath) => fs.unlink(filepath, (err) => console.log(err))

const removeFiles = (files) => Object.keys(files).forEach(
  (dir) => files[dir].forEach(
    (file) => removeFile(path.join(dir, file))
  )
)

export { removeFile, removeFiles }