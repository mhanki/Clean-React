import fs from 'fs'

const removeFile = (filepath) => fs.unlink(filepath, (err) => console.log(err))

export { removeFile }