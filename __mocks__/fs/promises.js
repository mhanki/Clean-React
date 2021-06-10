import dir from '../directory.js'

const writeFile = (path, data) => new Promise((resolve, reject) => {
  setTimeout(() => {
    dir.set({...dir.get(), [path]: data})
    resolve()
  }, 100)
})

const readdir = (directory) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(Object.keys(dir.get()).map((path) =>  {
      const [dirName, fileName] = path.split('/')
      if(dirName == directory){
        return fileName
      }
    }).filter(entry => entry != undefined))
  }, 100)
})

export { writeFile, readdir }