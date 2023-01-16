import fs from 'fs';
import { writeFile, unlink } from 'fs/promises'
import { FileInfo } from './FileInfo';

export class FileProcessor {
  getRelativePath(paths: string[] | string, splitter: string | RegExp): string[] | string{
    return Array.isArray(paths)
      ? paths.map(path => path.split(splitter)[1])
      : paths.split(splitter)[1]
  }

  readFiles = (paths: string[], dir: string): FileInfo[] => {
    const files = paths.map((path) => ({
      "path": path,
      "content": fs.readFileSync(path).toString()
    }));
  
    return files;
  }

  rewriteOne = (file: FileInfo): Promise<void> => writeFile(file.path, file.content);

  rewriteAll = (files: FileInfo[]): Promise<void>[]=> files.map(file => 
    writeFile(file.path, file.content)
  );

  removeOne = (path: string): Promise<void> => unlink(path);

  removeAll = (paths: string[]): Promise<void>[] => paths.map(path => this.removeOne(path));
}