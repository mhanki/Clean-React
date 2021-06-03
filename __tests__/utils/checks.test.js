import dir from '../../__mocks__/directory.js'
import { findMissingDirs, getModifiedFiles } from '../../src/utils/checks.js'

jest.mock('fs')

describe("findMissingDirs", () => {
  const dirsToCheck = ['public', 'src', 'node_modules']

  it("returns an array of missing directories", () => {
    dir.set({
      "src": {},
      "index.js": "content"
    })
  
    let missingDirs = findMissingDirs(dirsToCheck)
  
    expect(missingDirs).toEqual(['public', 'node_modules'])
  })
  
  it("returns empty array if no directories are missing", () => {
    dir.set({
      "src": {},
      "public": {},
      "node_modules": {}
    })
  
    let missingDirs = findMissingDirs(dirsToCheck)
  
    expect(missingDirs).toEqual([])
  })
})

describe("getModifiedFiles", () => {
  const files = {
    "index.html": { oldContent: "content" },
    "readme.md": { oldContent: "content" },
    "app.js": { oldContent: "content" }
  }

  const unmodifiedDir = {
    "index.html": "content",
    "readme.md": "content",
    "app.js": "content"
  }
  
  const modifiedDir = {
    "index.html": "modified content",
    "readme.md": "content"
  }

  it("returns an array of modified files", () => {
    dir.set(modifiedDir)

    let modifiedFiles = getModifiedFiles(files)

    expect(modifiedFiles).toEqual(["index.html", "app.js"])
  })

  it("returns an empty array if no files have been modified", () => {
    dir.set(unmodifiedDir)

    let modifiedFiles = getModifiedFiles(files)

    expect(modifiedFiles).toEqual([])
  })
})