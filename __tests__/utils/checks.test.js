import dir from '../../__mocks__/directory.js'
import { findMissingDirs } from '../../src/utils/checks.js'

jest.mock('fs')

const dirsToCheck = ['public', 'src', 'node_modules']

describe("findMissingDirs", () => {
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