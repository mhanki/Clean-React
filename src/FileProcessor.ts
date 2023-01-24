import fs from 'fs';
import path from 'path';
import { writeFile, unlink } from 'fs/promises'
import { FileInfo } from './FileInfo';

export class FileProcessor {
  getFilePaths = (directory: string): string[] => {
    let filePaths: string[] = [];
  
    _getPaths(directory);
  
    function _getPaths(dir: string): void {
      const dirContent = fs.readdirSync(dir);
    
      for(const content of dirContent) {
        const filePath = path.join(dir, content);
    
        if(fs.statSync(filePath).isDirectory()) {
            _getPaths(filePath);
        } else {
            filePaths.push(filePath);
        }
      }
    }
  
    return this.getRelativePath(filePaths, directory+'/') as string[];
  }
  
  getRelativePath(paths: string[] | string, splitter: string | RegExp): string[] | string{
    return Array.isArray(paths)
      ? paths.map(filePath => filePath.split(splitter)[1])
      : paths.split(splitter)[1]
  }

  readFiles = (files: string[], dir: string): FileInfo[] => {
    const fileInfos = files.map((file) => {
      const filePath = dir + '/' + file;

      return {
        "path": filePath,
        "relPath": file,
        "content": fs.readFileSync(filePath).toString()
      }
    });
  
    return fileInfos;
  }

  rewriteOne = (file: FileInfo): Promise<void> => writeFile(file.path, file.content);

  rewriteAll = (files: FileInfo[]): Promise<void>[]=> files.map(file => 
    writeFile(file.path, file.content)
  );

  writeAll = (files: FileInfo[], dir: string): Promise<void>[]=> files.map(file => {
    if(file.relPath.match(/^git\w*/)){
      file.relPath = '.' + file.relPath;
    }
    return writeFile(path.join(dir, file.relPath), file.content)
  });

  removeOne = (filePath: string): Promise<void> => unlink(filePath);

  removeAll = (paths: string[], dir:string): Promise<void>[] => paths.map(filePath => 
    this.removeOne(path.join(dir, filePath))
  );
}
