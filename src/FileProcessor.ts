import fs from 'fs';
import { writeFile, unlink } from 'fs/promises'
import { FileInfo } from './FileInfo';

export class FileProcessor {
  readFiles = (paths: string[]): FileInfo[] => {
    const files = paths.map((path) => ({
      "filename": path,
      "content": fs.readFileSync(path).toString()
    }));
  
    return files;
  }

  rewriteOne = (file: FileInfo): Promise<void> => writeFile(file.filename, file.content);

  rewriteAll = (files: FileInfo[]): Promise<void>[]=> files.map(file => 
    writeFile(file.filename, file.content)
  );

  removeOne = (path: string): Promise<void> => unlink(path);

  removeAll = (paths: string[]): Promise<void>[] => paths.map(path => this.removeOne(path));
}