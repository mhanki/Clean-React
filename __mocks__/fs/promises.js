import dir from '../directory'

const writeFile = (path, data) => new Promise((resolve, reject) => {
  setTimeout(() => {
    dir.set({...dir.get(), [path]: data})
    resolve()
  }, 100)
})

export { writeFile }