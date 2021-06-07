class Directory{

  constructor(){
    this.dir = {}
  }

  get(){
    return this.dir
  }

  set(files){
    this.dir = {...files}
  }

  remove(file){
    delete this.dir[file]
  }

  reset(){
    this.dir = {}
  }
  
}

export default new Directory()