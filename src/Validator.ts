import fs from 'fs';
import { readFile, readdir } from 'fs/promises'
import path from 'path';
import { FileInfo } from './FileInfo';

export class Validator {
  findMissingDirs = (dirs: string[]): string[] => dirs.filter(
    (dir: string) => !fs.existsSync(dir)
  );

  /**
   * @param targetDir Path to the directory that should be searched
   * @param files Array of relative filepaths to search for
   */
  removedFiles = (targetDir: string, files: string[]): string[] => files.filter((file) => {
    const filePath = path.join(targetDir, file);
    return !fs.existsSync(filePath);
  });

  changedFiles = async (templates: FileInfo[], files: string[]): Promise<string[]> => {
    let changedFiles: string[] = [];

    for await (const file of files) {
      const targetFilePath: string = path.join(process.cwd(), file);
      const templateFile = templates.find((temp: FileInfo) => temp.filename.split(/\/[JT]S\//)[1] === file);
      
      await readFile(targetFilePath)
        .then((content) => {
          if(templateFile === undefined){ 
            throw new Error(`Missing template file ${file}`)
          }

          if(content.toString() !== templateFile.content){
            changedFiles.push(file);
          }
        })
        .catch(err => { console.log(err); });
    }

    return changedFiles;
  }

  determineLanguage = async (directory: string): Promise<string> => {
    const srcFiles = await readdir(directory);
    const filteredFiles = srcFiles.filter(file => path.extname(file).match(/\.[tj]sx?$/));
    const extension = path.extname(filteredFiles[0]);

    return extension === '.js' 
      ? "JS"
      : "TS"
  }

  getTemplatePaths = (dirPath: string): string[] => {
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
}