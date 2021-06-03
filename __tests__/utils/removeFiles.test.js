import dir from '../../__mocks__/directory.js'
import fs from '../../__mocks__/fs.js'
import { removeFile, removeFiles } from '../../src/utils/removeFiles.js'

jest.mock('fs')

const directory = {
  "readme.md": "content",
  "src/app.js": "app content",
}

beforeEach(() => {
  dir.set(directory)
})

afterEach(() => dir.reset())

describe("removeFile", () => {
  it("succesfully removes existing file", () => {
    expect(fs.existsSync("src/app.js")).toBe(true)

    removeFile("src/app.js")

    expect(fs.existsSync("src/app.js")).toBe(false)
  })
  
  it("doesn't remove anything if file doesn't exist", () => {
    expect(fs.existsSync("wrongFilepath.js")).toBe(false)

    removeFile("wrongFilepath.js")

    expect(dir.get()).toEqual(directory)
  })
})

describe("removeFiles", () => {
  it("succesfully removes all files", async () => {
    const files = {
      "src": ["app.js"],
      ".": ["readme.md"]
    }
    expect(dir.get()).toEqual(directory)

    removeFiles(files)

    expect(dir.get()).toEqual({})
  })
})
