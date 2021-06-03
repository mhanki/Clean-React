import dir from '../../__mocks__/directory.js'
import fs from '../../__mocks__/fs.js'
import { rewriteFile, rewriteFiles } from '../../src/utils/rewriteFiles.js'

jest.mock('fs')
jest.mock('fs/promises')

afterEach(() => dir.reset())

describe("rewriteFile", () => {
  it("creates a new file if file doesn't exist", async () => {
    expect(fs.existsSync("app.js")).toBe(false)

    await rewriteFile("app.js", "content")

    expect(dir.get()).toEqual({ "app.js": "content" })
  })
  
  it("rewrites content of existing file", async () => {
    dir.set({ "app.js": "content"})

    expect(fs.existsSync("app.js")).toBe(true)

    await rewriteFile("app.js", "updated content")

    expect(dir.get()).toEqual({ "app.js": "updated content" })
  })
})

describe("rewriteFiles", () => {
  it("succesfully rewrites all files", async () => {
    const files = {
      "index.html": { newContent: "content"},
      "index.css": { newContent: "more content"},
      "app.js": { newContent: "updated content"}
    }
    dir.set({ "app.js": "content"})

    expect(dir.get()).toEqual({ "app.js": "content"})

    await rewriteFiles(files)

    expect(dir.get()).toEqual({
      "index.html": "content",
      "index.css": "more content",
      "app.js": "updated content"
    })
  })
})
