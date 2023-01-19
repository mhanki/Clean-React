import dir from '../__mocks__/directory.js';
import readline from 'readline';
import { CleanReact } from '../src/CleanReact';

jest.mock('fs');
jest.mock('fs/promises');

jest.mock('readline', () => ({
  createInterface: jest.fn().mockReturnValue({
    question: jest.fn(),
    close: jest.fn()
  })
}))

afterEach(() => {
  dir.reset();
  /* readline.createInterface().question.mockClear() */
});

const cleanReact = new CleanReact('');

describe('CleanReact.isDirCraProject',() => {
  it("returns true if 'src' and 'public' folders are present",  async () => {
    dir.set({
      "src": {},
      "public": {}
    })

    const result = await cleanReact.isDirCraProject();
    expect(result).toBe(true);
  })

  it("returns true if folders are missing, but user gives permission to proceed",  async () => {
    dir.set({
      "src": {},
    })

    readline.createInterface().question
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('y'), 100));

    const result = await cleanReact.isDirCraProject();
    expect(result).toBe(true);
  })

  it("returns false if folders are missing and user denies permission to proceed",  async () => {
    dir.set({
      "src": {},
    })

    readline.createInterface().question
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('n'), 100));

    const result = await cleanReact.isDirCraProject();
    expect(result).toBe(false);
  })
})

describe('CleanReact.getFilesToKeep', () => {
  it('returns an empty array if user wants to discard all changes', async () => {
    const files = ['project/file1', 'project/file2'];

    readline.createInterface().question
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('y'), 100));

    const keep = await cleanReact.getFilesToKeep(files);

    expect(keep).toEqual([]);
  })

  it('returns an array of files the user wants to keep', async () => {
    const files = ['project/file1', 'project/file2'];

    readline.createInterface().question
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('n'), 100))
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('y'), 100))
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('n'), 100));

    const keep = await cleanReact.getFilesToKeep(files);

    expect(keep).toEqual(['file1']);
  })
})

describe('CleanReact.run', () => {
  it('', async () => {
    dir.set({
      "project": {
        "src": {
          "App.js": "diff content",
          "App.css": "content",
          "setupTests.js": "content"
        },
        "public": {
          "index.html": "content"
        },
        "newFile.js": "content"
        },
        "templates": {
          "cra": { "JS" : {
            "src": {
              "App.js": "content",
              "App.css": "content",
              "logo.svg": "content",
              "setupTests.js": "content"
            },
            "public": { "index.html": "content"}
          }},
          "default": { "JS" : {
            "src": {
              "App.js": "new content",
              "App.css": "new content"
            },
            "public": { 
              "index.html": "new content",
              "index.css": "new content"
            }
          }}
        }
      }
    )

    const project = {
      "src": {
        "App.js": "diff content",
        "App.css": "new content"
      },
      "public": { 
        "index.html": "new content",
        "index.css": "new content"
      },
      "newFile.js": "content"
    }

    const app = new CleanReact('project');

    app.TEMPLATES_DIR = 'templates'

    readline.createInterface().question
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('n'), 100))
      .mockImplementationOnce((query, callback) => setTimeout(() => callback('y'), 100));

    await app.run()
    expect(dir.get()['project']).toEqual(project)
  })
})