class Directory{

  constructor(){
    this.dir = {}
  }

  get(){
    return this.dir
  }

  getOne(path){
    const keys = path.split('/');
    let content = this.dir;

    for(let key of keys) {
      content = content[key]
    }

    return content;
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