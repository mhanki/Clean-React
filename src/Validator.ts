import fs from 'fs';
import * as fsPromises from 'fs/promises';
import path from 'path';

export class Validator {
  findMissingDirs = (dirs: string[]): string[] => dirs.filter(
    (dir: string) => !fs.existsSync(dir)
  );

  // findModifiedFiles
  getFilePaths = (dirPath: string): string[] => {
    let paths: string[] = [];

    const _getPaths = (dirPath: string): void => {
      const filesInDirectory = fs.readdirSync(dirPath);
    
      for(const file of filesInDirectory) {
        const filePath = path.join(dirPath, file);
    
        if(fs.statSync(filePath).isDirectory()) {
            _getPaths(filePath);
        } else {
            paths.push(filePath);
        }
      }
    }

    _getPaths(dirPath);
  
    return paths;
  }

  /**
   * @param targetDir Path to the directory that should be searched
   * @param files Array of relative filepaths to search for
   */
  removedFiles = (targetDir: string, files: string[]): string[] => files.filter((file) => {
    const filePath = path.join(targetDir, file);
    return !fs.existsSync(filePath);
  });

  /**
   * @param templateDir Path to the directory that contains the templates to compare against
   * @param files Array of relative filepaths to check
   */
  changedFiles = async (templateDir: string, files: string[]): Promise<string[]> => {
    let changedFiles: string[] = [];

    for await (const file of files) {
      const templateFilePath: string = path.join(__dirname, templateDir, file);
      const targetFilePath: string = path.join(process.cwd(), file);

      const templatePromise = fsPromises.readFile(templateFilePath);
      const targetPromise = fsPromises.readFile(targetFilePath);

      await Promise.all([templatePromise, targetPromise])
        .then((values) => {
          if(values[0] !== values[1]){
            changedFiles.push(file);
          }
        })
        .catch(err => { console.log(err); })
    }

    return changedFiles;
  }

  // checkFileType
  // checkFiles
  // validate
}