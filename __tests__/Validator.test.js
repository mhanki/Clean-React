import dir from '../__mocks__/directory.js';
import { Validator } from '../src/Validator.ts';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('readline');

afterEach(() => {
  dir.reset();
});

const FileValidator = new Validator();

describe('Validator.findMissingDirs', () => {
  it('returns an array of missing directories', () => {
    dir.set({
      "src": {},
      "index.js": "content"
    });

    const dirsToFind = ['src', 'public', 'node_modules'];
    const missingDirs = FileValidator.findMissingDirs(dirsToFind);
    
    expect(missingDirs).toEqual(['public', 'node_modules']);
  })
})

describe('Validator.removedFiles', () => {
  it('returns an array of removed files', () => {
    dir.set({
      "src": {
        "test.js": "content"
      },
      "index.js": "content"
    });

    const filesToFind = ['index.js', 'src/test.js'];

    const removedFiles = FileValidator.removedFiles('', filesToFind);

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
        "filename": "templates/JS/src/App.js",
        "content": "content"
      },
      {
        "filename": "templates/JS/src/App.css",
        "content": "same content"
      },
    ];
    
    const filesToCheck = ['src/App.js', 'src/App.css'];
    const changedFiles = await FileValidator.changedFiles(templates, filesToCheck);

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

    const language = await FileValidator.determineLanguage('src');
    
    expect(language).toEqual('TS');
  })
})