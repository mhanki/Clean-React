import { Prompt } from './Prompt';
import { Validator } from './Validator';
import { FileProcessor } from './FileProcessor';
import { Symbol } from './Symbol';
import { FileInfo } from './FileInfo';
import path from 'path';

const consolePrompt = new Prompt();
const validator = new Validator();
const fileProcessor = new FileProcessor();

export class CleanReact {
  targetDir: string;

  constructor(dir: string) {
    this.targetDir = dir;
  }
  
  TEMPLATES_DIR = path.join(__dirname, '..', '..', 'templates');

  async isDirCraProject(): Promise<boolean> {
    let result: boolean = true;
  
    const craDirectories = ['src', 'public'].map(dir => path.join(this.targetDir, dir));
    const missingDirs = validator.findMissingDirs(craDirectories);
    
    if(missingDirs.length > 0) {
      const message = [
        `${Symbol.WARNING}\xa0\xa0\xa0It seems your project is missing the following Create React App sub-directories:`,
        ...missingDirs.map(dir => "\xa0\xa0\xa0- " + dir)
      ];
      consolePrompt.message(message, "WARNING");
  
      // Prompt for permission to proceed
      await consolePrompt.permission("Are you sure you want to proceed?", "WARNING")
        .then(val => result = val);
    }
  
    return result;
  }
  
  getFiles(directory: string): FileInfo[] {
    const paths: string[] = fileProcessor.getFilePaths(directory);
    return fileProcessor.readFiles(paths, directory);
  }
  
  async getFilesToKeep(files: string[]): Promise<string[]> {
    let keep: string[] = [];
  
    if(files.length > 0) {
      const message = [
        "The following files already contain changes to the original CRA template:",
        ...files.map(file => "\xa0\xa0- " + file)
      ];
    
      consolePrompt.message(message, "WARNING");
  
      const permission = await consolePrompt.permission("Do you want to discard all previous changes?");

      if(!permission) {
        for await (const file of files) {
          const filename = fileProcessor.getRelativePath([file], this.targetDir+'/')[0];
          const message = "Do you want to keep the changs made to " + filename + "?"
          await consolePrompt.permission(message)
            .then(permission => {
              if(permission) {
                keep.push(filename);
              }
            });
        }
      }
    }
  
    return keep;
  }

  async run(){
    const startMessage = [`Cleaning... ${Symbol.CLEANING}`];
    consolePrompt.message(startMessage);

    const proceed = await this.isDirCraProject();
    
    if(!proceed) {
      return;
    }
    
    const language: string = await validator.determineLanguage(path.join(this.targetDir,'src'));
    const templateType = 'default'; // Check config here

    const craTemplates: FileInfo[] = this.getFiles(path.join(this.TEMPLATES_DIR, 'cra', language));
    
    const templates: FileInfo[] = this.getFiles(path.join(this.TEMPLATES_DIR, templateType, language));
    const targetPaths: string[] = fileProcessor.getFilePaths(this.targetDir); //  + "/public"
    
    const modifiedFiles: string[] = await validator.changedFiles(craTemplates, this.targetDir);
    const filesToKeep: string[] = await this.getFilesToKeep(modifiedFiles);

    let removeFiles = targetPaths
      .filter(file => craTemplates.find(template => template.relPath === file))
      .filter(file => !templates.find(template => template.relPath === file))

    let write = templates.filter(template => !filesToKeep.includes(template.relPath))

    await Promise.all(fileProcessor.writeAll(write, this.targetDir))

    removeFiles.filter(file => !filesToKeep.includes(file))

    await Promise.all(fileProcessor.removeAll(removeFiles, this.targetDir))

    const endMessage = [`${Symbol.STARS} All done! ${Symbol.STARS}`, " Happy coding!"];
    consolePrompt.message(endMessage);
        
  }
}