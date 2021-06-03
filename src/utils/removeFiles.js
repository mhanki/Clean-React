import fs from 'fs'
import path from 'path'

const removeOne = (filepath) => fs.unlink(filepath, (err) => console.log(err))

const removeAll = (files) => Object.keys(files).forEach(
  (dir) => files[dir].forEach(
    (file) => removeOne(path.join(dir, file))
  )
)

export { removeOne, removeAll }