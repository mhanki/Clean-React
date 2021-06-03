import dir from '../../__mocks__/directory.js'
import fs from '../../__mocks__/fs.js'
import { removeOne, removeAll } from '../../src/utils/removeFiles.js'

jest.mock('fs')

const directory = {
  "readme.md": "content",
  "src/app.js": "app content",
}

beforeEach(() => {
  dir.set(directory)
})

afterEach(() => dir.reset())

describe("removeOne", () => {
  it("succesfully removes existing file", () => {
    expect(fs.existsSync("src/app.js")).toBe(true)

    removeOne("src/app.js")

    expect(fs.existsSync("src/app.js")).toBe(false)
  })
  
  it("doesn't remove anything if file doesn't exist", () => {
    expect(fs.existsSync("wrongFilepath.js")).toBe(false)

    removeOne("wrongFilepath.js")

    expect(dir.get()).toEqual(directory)
  })
})

describe("removeAll", () => {
  it("succesfully removes all files", async () => {
    const files = {
      "src": ["app.js"],
      ".": ["readme.md"]
    }
    expect(dir.get()).toEqual(directory)

    removeAll(files)

    expect(dir.get()).toEqual({})
  })
})
