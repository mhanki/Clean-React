import dir from './directory.js'

const fs = jest.createMockFromModule('fs')

const unlink = (path) => dir.remove(path)

const writeFile = (path, data) => new Promise((resolve, reject) => {
  setTimeout(() => {
    dir.set({...dir.get(), [path]: data})
    resolve()
  })
})

const existsSync = (path) => dir.get().hasOwnProperty(path)

fs.unlink = unlink
fs.writeFile = writeFile
fs.existsSync = existsSync

export default fs
