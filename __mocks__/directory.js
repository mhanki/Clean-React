class Directory{

  constructor(){
    this.files = {}
  }

  get(){
    return this.files
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

  }

  setIncorrectDirectory(){
    
  }
}

export default new Directory()