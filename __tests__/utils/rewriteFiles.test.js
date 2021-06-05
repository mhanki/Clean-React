import dir from '../../__mocks__/directory.js'
import fs from '../../__mocks__/fs.js'
import * as prompts from '../../src/utils/userPrompts'
import { rewriteOne, rewriteAll, rewriteWithPermission } from '../../src/utils/rewriteFiles.js'

jest.mock('fs')
jest.mock('fs/promises')

afterEach(() => dir.reset())

describe("rewriteOne", () => {
  it("creates a new file if file doesn't exist", async () => {
    expect(fs.existsSync("app.js")).toBe(false)

    await rewriteOne("app.js", "content")

    expect(dir.get()).toEqual({ "app.js": "content" })
  })
  
  it("rewrites content of existing file", async () => {
    dir.set({ "app.js": "content"})

    expect(fs.existsSync("app.js")).toBe(true)

    await rewriteOne("app.js", "updated content")

    expect(dir.get()).toEqual({ "app.js": "updated content" })
  })
})

describe("rewriteAll", () => {
  it("succesfully rewrites all files", async () => {
    const files = {
      "index.html": { newContent: "content"},
      "index.css": { newContent: "more content"},
      "app.js": { newContent: "updated content"}
    }
    dir.set({ "app.js": "content"})

    expect(dir.get()).toEqual({ "app.js": "content"})

    let promiseArray = rewriteAll(files)
    await Promise.all(promiseArray)

    expect(dir.get()).toEqual({
      "index.html": "content",
      "index.css": "more content",
      "app.js": "updated content"
    })
  })
})

describe("rewriteWithPermission", () => {
  it("rewrites all files if permission is given", async () => {
    const getPermissionSpy = jest.spyOn(prompts, 'getPermission')
    getPermissionSpy.mockReturnValue(true)

    const files = {
      "index.html": { newContent: "content"},
      "index.css": { newContent: "more content"},
      "app.js": { newContent: "updated content"}
    }

    dir.set({ "app.js": "content"})
  
    expect(dir.get()).toEqual({ "app.js": "content"})
  
    let promiseArray = await rewriteWithPermission(files)
    await Promise.all(promiseArray)
  
    expect(dir.get()).toEqual({
      "index.html": "content",
      "index.css": "more content",
      "app.js": "updated content"
    })
  })

  it("rewrites no files if permission is denied", async () => {
    const getPermissionSpy = jest.spyOn(prompts, 'getPermission')
    getPermissionSpy.mockReturnValue(false)

    const files = {
      "index.html": { newContent: "content"},
      "index.css": { newContent: "more content"},
      "app.js": { newContent: "updated content"}
    }

    dir.set({ "app.js": "content"})
  
    expect(dir.get()).toEqual({ "app.js": "content"})
  
    let promiseArray = await rewriteWithPermission(files)
    await Promise.all(promiseArray)
  
    expect(dir.get()).toEqual({ "app.js": "content"})
  })
})
