import dir from '../__mocks__/directory.js';
import fs from '../__mocks__/fs.js';
import { FileProcessor } from '../src/FileProcessor';

jest.mock('fs');
jest.mock('fs/promises');

afterEach(() => {
  dir.reset();
});

const fileProcessor = new FileProcessor();

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
      "filename": file,
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
    const newFile = { filename: "src/index.js", content: "content" };
    
    expect(fs.existsSync(newFile.filename)).toBe(false);

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
    const updatedFile = { filename: "src/App.js", content: "updated content" }

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
      {"filename": "src/App.js", "content": "updated content"},
      {"filename": "index.js", "content": "new file"}
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