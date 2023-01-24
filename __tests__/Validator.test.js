import dir from '../__mocks__/directory.js';
import { Validator } from '../src/Validator.ts';

jest.mock('fs');
jest.mock('fs/promises');

afterEach(() => {
  dir.reset();
});

const fileValidator = new Validator();

describe('Validator.findMissingDirs', () => {
  it('returns an array of missing directories', () => {
    dir.set({
      "src": {},
      "index.js": "content"
    });

    const dirsToFind = ['src', 'public', 'node_modules'];
    const missingDirs = fileValidator.findMissingDirs(dirsToFind);
    
    expect(missingDirs).toEqual(['public', 'node_modules']);
  })
})

describe('Validator.removedFiles', () => {
  it('returns an array of removed files', () => {
    dir.set({
      "src": { },
      "index.js": "content"
    });

    const filesToFind = ['index.js', 'src/test.js'];

    const removedFiles = fileValidator.removedFiles('', filesToFind);

    expect(removedFiles).toEqual(['src/test.js']);
  })
})

describe('Validator.changedFiles', () => {
  it('returns an array of files with different content', async () => {
    dir.set({
      "src": {
        "App.js": "modified content",
        "App.css": "same content"
      }
    });

    const templates = [
      {
        "path": "templates/JS/src/App.js",
        "content": "content"
      },
      {
        "path": "templates/JS/src/App.css",
        "content": "same content"
      },
    ];
    
    const targetDir = '';
    const changedFiles = await fileValidator.changedFiles(templates, targetDir);

    expect(changedFiles).toEqual(['src/App.js']);
  })
})

describe('Validator.determineLanguage', () => {
  it('returns sourcecode language', async () => {
    dir.set({
      "src": {
        "App.tsx": "content",
        "index.ts": "content"
      }
    })

    const language = await fileValidator.determineLanguage('src');
    
    expect(language).toEqual('TS');
  })
})