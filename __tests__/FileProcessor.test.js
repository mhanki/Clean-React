import dir from '../__mocks__/directory.js';
import fs from '../__mocks__/fs.js';
import { FileProcessor } from '../src/FileProcessor';
import path from 'path';

jest.mock('fs');
jest.mock('fs/promises');

afterEach(() => {
  dir.reset();
});

const fileProcessor = new FileProcessor();

describe('FileProcessor.getRelativePath', () => {
  it('returns a path relative to a given splitter', () => {
    const filePath = path.join(__dirname, 'src/App.js');

    const relativePath = fileProcessor.getRelativePath(filePath, __dirname + '/');
    expect(relativePath).toEqual('src/App.js');
  });

  it('accepts and converts a single path or an array of paths', () => {
    const filePaths = [
      path.join(__dirname, 'src/App.js'),
      path.join(__dirname, 'src/App.css')
    ];

    const singlePath = fileProcessor.getRelativePath(filePaths[0], __dirname + '/');
    const multiPaths = fileProcessor.getRelativePath(filePaths, __dirname + '/');
    expect(singlePath).toEqual('src/App.js');
    expect(multiPaths).toEqual(['src/App.js', 'src/App.css']);
  });

  it('accepts a string or regex as the splitter', () => {
    const filePath = path.join(__dirname, 'JS', 'src/App.js');
    const regex = new RegExp(/\/[JT]S\//);

    const stringSplit = fileProcessor.getRelativePath(filePath, __dirname + '/');
    const regexSplit = fileProcessor.getRelativePath(filePath, regex);

    expect(stringSplit).toEqual('JS/src/App.js');
    expect(regexSplit).toEqual('src/App.js');
  })
})

describe('FileProcessor.readFiles', () => {
  it('returns array with filenames and their contents', () => {
    dir.set({
      "src": {
        "App.js": "App.js content"
      },
      "index.js": "index.js content"
    })

    const files = ["src/App.js", "index.js"];

    const readFiles = fileProcessor.readFiles(files);

    expect(readFiles).toEqual(files.map(file => ({
      "path": file,
      "content": dir.getOne(file)
    })));
  })
})

describe('FileProcessor.rewriteOne', () => {
  it("creates a new file if file doesn't exist", async () => {
    const directory ={
      "src": {
        "App.js": "content"
      }
    };

    dir.set(directory);
    const newFile = { path: "src/index.js", content: "content" };
    
    expect(fs.existsSync(newFile.path)).toBe(false);

    await fileProcessor.rewriteOne(newFile);

    expect(dir.get()).toEqual({ 
      ...directory, 
      'src': { 
        ...directory['src'],
        'index.js': 'content'
      }});
  })
  
  it("rewrites content of existing file", async () => {
    const directory ={
      "src": {
        "App.js": "content"
      }
    };

    dir.set(directory);
    const updatedFile = { path: "src/App.js", content: "updated content" }

    expect(fs.existsSync("src/App.js")).toBe(true);

    await fileProcessor.rewriteOne(updatedFile);

    expect(dir.get()).toEqual({ 
      ...directory, 
      'src': { 
        ...directory['src'],
        'App.js': 'updated content'
      }});
  })
})

describe('FileProcessor.rewriteAll', () => {
  it('rewrites an array of files', async() => {
    dir.set({
      "src": {
        "App.js": "content"
      }
    });

    const files = [
      {"path": "src/App.js", "content": "updated content"},
      {"path": "index.js", "content": "new file"}
    ];

    await Promise.all(fileProcessor.rewriteAll(files));

    expect(dir.get()).toEqual({
      "src": {
        "App.js": "updated content"
      },
      "index.js": "new file"
    })
  })
})

describe("FileProcessor.removeOne", () => {
  it("succesfully removes existing file", async () => {
    dir.set({
      "src": {
        "App.js": "content"
      }
    });

    const fileToRemove = "src/App.js";

    expect(fs.existsSync(fileToRemove)).toBe(true);

    await fileProcessor.removeOne(fileToRemove);

    expect(fs.existsSync(fileToRemove)).toBe(false);
  })
})

describe("FileProcessor.removeAll", () => {
  it("removes array of file paths", async () => {
    dir.set({
      "src": {
        "App.js": "content"
      },
      "index.js": "content"
    });

    const filePaths = ["src/App.js", "index.js"];

    expect(fs.existsSync(filePaths[0])).toBe(true);
    expect(fs.existsSync(filePaths[1])).toBe(true);

    await Promise.all(fileProcessor.removeAll(filePaths));

    expect(dir.get()).toEqual({ "src": {}});
  })
})