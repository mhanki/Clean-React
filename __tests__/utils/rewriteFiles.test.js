import dir from '../../__mocks__/directory.js'
import fs from '../../__mocks__/fs.js'
import * as prompts from '../../src/utils/userPrompts'
import { rewriteOne, rewriteAll, rewriteWithPermission } from '../../src/utils/rewriteFiles.js'

jest.mock('fs')
jest.mock('fs/promises')

const getPermissionSpy = jest.spyOn(prompts, 'getPermission')

const files = {
  "index.html": { newContent: "new content"},
  "index.css": { newContent: "new content"},
  "app.js": { newContent: "new content"}
}
const directory = { "app.js": "content" }
const updatedDirectory = {
  "index.html": "new content",
  "index.css": "new content",
  "app.js": "new content"
}

beforeEach(() => { dir.set(directory)})

afterEach(() => {
  dir.reset()
  jest.clearAllMocks()
})

describe("rewriteOne", () => {
  it("creates a new file if file doesn't exist", async () => {
    const newFile = {path: "index.js", data: "content"}

    expect(fs.existsSync(newFile.path)).toBe(false)

    await rewriteOne(newFile.path, newFile.data)

    expect(dir.get()).toEqual({...directory, [newFile.path]: newFile.data })
  })
  
  it("rewrites content of existing file", async () => {
    expect(fs.existsSync("app.js")).toBe(true)

    await rewriteOne("app.js", "updated content")

    expect(dir.get()).toEqual({ "app.js": "updated content" })
  })
})

describe("rewriteAll", () => {
  it("succesfully rewrites all files", async () => {
    let promiseArray = rewriteAll(files)
    await Promise.all(promiseArray)

    expect(dir.get()).toEqual(updatedDirectory)
  })
})

describe("rewriteWithPermission", () => {
  it("rewrites all files if permission is given", async () => {
    getPermissionSpy.mockReturnValue(true)
  
    let promiseArray = await rewriteWithPermission(files)
    await Promise.all(promiseArray)
  
    expect(dir.get()).toEqual(updatedDirectory)
  })

  it("rewrites no files if permission is denied", async () => {
    getPermissionSpy.mockReturnValue(false)
  
    let promiseArray = await rewriteWithPermission(files)
    await Promise.all(promiseArray)
  
    expect(dir.get()).toEqual(directory)
  })
})
