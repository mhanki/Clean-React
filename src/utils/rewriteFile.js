import fs from 'fs'

const rewriteFile = (path, data) => fs.writeFile(path, data, (err) => {
  if(err) console.log(err)
})

export default rewriteFile