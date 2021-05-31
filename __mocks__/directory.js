class Directory{

  constructor(){
    this.files = {}
  }

  getFiles(){
    return this.files
  }

  getDir(){
    return this.dir
  }

  set(files){
    this.files = {...files}
  }

  remove(file){
    delete this.files[file]
  }

  reset(){
    this.files = {}
  }

  setCorrectDirectory(){
    this.dir = {
      "src": {},
      "public": {}
    }
  }

  setIncorrectDirectory(){
    this.dir = {
      "src": {},
      "index.js": "content"
    }
  }
}

export default new Directory()