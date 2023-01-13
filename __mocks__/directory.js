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

  setOne(path, content){
    const keys = path.split('/');
    const dir = this.get();

    keys.reduce((o, k, i) => { 
      if(i === keys.length - 1){
        return o[k] = content;
      }

      if(o[k] !== undefined){
        return o[k] = o[k];
      }

      return o[k] = {}; 
    }, dir);
  }

  remove(path){
    const keys = path.split('/');
    let obj = this.dir;

    for(let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }

    delete obj[keys.pop()];
  }

  reset(){
    this.dir = {}
  }
  
}

export default new Directory()