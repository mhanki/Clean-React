import dir from './directory.js'

const fs = jest.createMockFromModule('fs')

const unlink = (path) => dir.remove(path)

const writeFile = (path, data) => new Promise((resolve, reject) => {
  setTimeout(() => {
    dir.set({...dir.getFiles(), [path]: data})
    resolve()
  })
})

const existsSync = (path) => dir.getFiles().hasOwnProperty(path)

fs.unlink = unlink
fs.writeFile = writeFile
fs.existsSync = existsSync

export default fs
