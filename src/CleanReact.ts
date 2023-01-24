import path from 'path';
import { Prompt } from './Prompt';
import { Validator } from './Validator';
import { FileProcessor } from './FileProcessor';
import { Symbol } from './Symbol';
import { FileInfo } from './FileInfo';

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
    const templateType = 'default';
    // const templateType = process.argv[2] ? process.argv[2] : 'default';
    const templateFolder = path.join(this.TEMPLATES_DIR, templateType, language);

    /* if(!fs.existsSync(templateFolder)){
      return consolePrompt.message(["The template folder doesn't exist", templateFolder]);
    } */

    const craTemplates: FileInfo[] = this.getFiles(path.join(this.TEMPLATES_DIR, 'cra', language));
    const templates: FileInfo[] = this.getFiles(templateFolder);
    const targetPaths: string[] = fileProcessor.getFilePaths(this.targetDir);
    
    const modifiedFiles: string[] = await validator.changedFiles(craTemplates, this.targetDir);
    const filesToKeep: string[] = await this.getFilesToKeep(modifiedFiles);

    const filesToRemove = targetPaths
      .filter(targetPath => craTemplates.find(template => template.relPath === targetPath))
      .filter(targetPath => !templates.find(template => template.relPath === targetPath))
      .filter(targetPath => !filesToKeep.includes(targetPath));

    const filesToRewrite = templates.filter(template => !filesToKeep.includes(template.relPath));

    await Promise.all(fileProcessor.writeAll(filesToRewrite, this.targetDir));
    await Promise.all(fileProcessor.removeAll(filesToRemove, this.targetDir));

    const endMessage = [`${Symbol.STARS} All done! ${Symbol.STARS}`, " Happy coding!"];
    consolePrompt.message(endMessage);
  }
}