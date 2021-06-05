import fs from 'fs'
import path from 'path'

const removeOne = (filepath) => fs.unlink(filepath, (err) => {if(err && err.errno != -2) console.log(err)})

const removeAll = (files) => Object.keys(files).forEach(
  (dir) => files[dir].forEach(
    (file) => removeOne(path.join(dir, file))
  )
)

export { removeOne, removeAll }