import dir from '../../__mocks__/directory.js'
import { checkFiles } from '../../src/utils/checkFiles.js'
import * as checks from '../../src/utils/checks.js'
import * as prompts from '../../src/utils/userPrompts.js'
import * as rewriteFiles from '../../src/utils/rewriteFiles.js'

jest.mock('fs')
jest.mock('fs/promises')

const unmodifiedDir = {
  "index.html": "content",
  "readme.md": "content",
  "app.js": "content"
}

const modifiedDir = {
  "index.html": "modified content",
  "readme.md": "content"
}

const files = {
  "index.html": { oldContent: "content", newContent: "new content" },
  "readme.md": { oldContent: "content", newContent: "new content" },
  "app.js": { oldContent: "content", newContent: "new content" }
}

const getModifiedSpy = jest.spyOn(checks, 'findModifiedFiles')
const permissionSpy = jest.spyOn(prompts, 'getPermission')
const rewriteAllSpy = jest.spyOn(rewriteFiles, 'rewriteAll')

afterEach(() => { 
  dir.reset()
  jest.clearAllMocks()
})

describe("checkFiles", () => {
  dir.set(modifiedDir)
  const [unmodified, [modifiedPaths, modifiedFiles]] = checkFiles(files)

  it("returns array of modified file paths", () => {
    expect(modifiedPaths).toEqual(["index.html", "app.js"])
  })
  
  it("returns modified files", () => {
    expect(modifiedFiles).toEqual({
      "index.html": { oldContent: "content", newContent: "new content" },
      "app.js": { oldContent: "content", newContent: "new content" }
    })
  })
  
  it("returns unmodified files", () => {
    expect(unmodified).toEqual({"readme.md": { oldContent: "content", newContent: "new content" }})
  })
})

/* it("rewrites all files immediately if persmission is given", async () => {
  dir.set(modifiedDir)
  permissionSpy.mockReturnValueOnce(true)

  await checkFiles(files)

  expect(rewriteAllSpy).toHaveBeenCalledTimes(2)
})

it("prompts user for each file if permission is denied", async () => {
  dir.set(modifiedDir)
  permissionSpy
    .mockReturnValueOnce(false)
    .mockReturnValue(true)

  await checkFiles(files)

  expect(rewriteAllSpy).toHaveBeenCalledTimes(1)
})


it.only("rewrites file if permission is given", async () => {
  dir.set(modifiedDir)
  permissionSpy
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(true)

  let res = await checkFiles(files)
  console.log(res)
  //expect(dir.get()).toEqual({})
})

it("does not rewrite file if persmission is denied", async () => {
  
}) */