import dir from '../directory.js'

const writeFile = (path, data) => new Promise((resolve, reject) => {
  setTimeout(() => {
    dir.setOne(path, data);
    resolve()
  }, 100)
})

const readdir = (directory) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const obj = dir.getOne(directory);
    resolve(Object.keys(obj));
  }, 100)
})

const readFile = (path) => new Promise((resolve, reject) => {
    const keys = path.split('/');
    let obj = dir.get();

    for(let key of keys) {
      obj = obj[key]
    }

    resolve(obj);
})

const unlink = (path) => new Promise((resolve, reject) => {
  setTimeout(() => {
    dir.remove(path)
    resolve();
  }, 100)
})

export { writeFile, readdir, readFile, unlink }