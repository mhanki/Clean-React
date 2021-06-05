import dir from '../__mocks__/directory.js'
import { cleanup } from '../src/cleanup.js'
import * as removeFiles from '../src/utils/removeFiles.js'
import * as checkFiles from '../src/utils/checkFiles.js'
import * as prompts from '../src/utils/userPrompts.js'
import * as rewriteFiles from '../src/utils/rewriteFiles.js'

jest.mock('fs')
jest.mock('fs/promises')

const removeAllSpy = jest.spyOn(removeFiles, 'removeAll')
const checkFilesSpy = jest.spyOn(checkFiles, 'checkFiles')
const rewriteAllSpy = jest.spyOn(rewriteFiles, 'rewriteAll')
const permissionSpy = jest.spyOn(prompts, 'getPermission')

const directory = {
  "index.html": "modified content",
  "app.js": "content",
  "src/setupTests.js": "",
}

const remove = {
  "src": [
    "setupTests.js",
    "reportWebVitals.js"
  ],
  "public": [
    "favicon.ico"
  ]
}

const rewrite = {
  "index.html": {
    oldContent: "content",
    newContent: "new content"
  },
  "app.js": {
    oldContent: "content",
    newContent: "new content"
  },
  "readme.md": {
    oldContent: "content",
    newContent: "new content"
  }
}

beforeEach(() => {
  dir.reset()
  dir.set(directory)
  jest.clearAllMocks()
})

it("removes all files", async () => {
  permissionSpy.mockReturnValueOnce(true)

  await cleanup(remove, rewrite)

  expect(removeAllSpy).toHaveBeenCalledTimes(1)
  expect(removeAllSpy).toHaveBeenCalledWith(remove)
})

it("checks for modified files", async () => {
  permissionSpy.mockReturnValueOnce(true)

  await cleanup(remove, rewrite)

  expect(checkFilesSpy).toHaveBeenCalledTimes(1)
  expect(checkFilesSpy).toHaveBeenCalledWith(rewrite)
})

it('immediately starts rewriting unmodified files', async () => {
  await cleanup(remove, {"app.js": {
    oldContent: "content",
    newContent: "new content"
  }})

  expect(rewriteAllSpy).toHaveBeenCalledTimes(1)
  expect(rewriteAllSpy).toHaveBeenCalledWith({"app.js": {
    oldContent: "content",
    newContent: "new content"
  }})
})

it('stops when there are no modified files', async () => {
  await cleanup(remove, {"app.js": {
    oldContent: "content",
    newContent: "new content"
  }})

  expect(rewriteAllSpy).toHaveBeenCalledTimes(1)
  expect(permissionSpy).toHaveBeenCalledTimes(0)
  expect(dir.get()).toEqual({
    "index.html": "modified content",
    "app.js": "new content"
  })
})

it("checks if user wants to rewrite all modified files", async () => {
  permissionSpy.mockReturnValueOnce(new Promise(
    (resolve, reject) => setTimeout(() => resolve(true), 500)
  ))

  await cleanup(remove, rewrite)

  expect(permissionSpy).toHaveBeenCalledTimes(1)
})

it("rewrites all files immediately if persmission is given", async () => {
  permissionSpy.mockReturnValueOnce(true)

  await cleanup(remove, rewrite)

  expect(rewriteAllSpy).toHaveBeenCalledTimes(2)
})

it("prompts user for each file if permission is denied", async () => {
  permissionSpy
    .mockReturnValueOnce(false)
    .mockReturnValue(true)

  await cleanup(remove, rewrite)

  expect(permissionSpy).toHaveBeenCalledTimes(3)
})

it("rewrites file if permission is given", async () => {
  permissionSpy
    .mockReturnValueOnce(false)
    .mockReturnValue(true)

  await cleanup(remove, rewrite)

  expect(dir.get()).toEqual({
    "app.js": "new content",
    "index.html": "new content",
    "readme.md" : "new content"
  })
})

it("does not rewrite file if permission is denied", async () => {
  permissionSpy
    .mockReturnValueOnce(false)
    .mockReturnValueOnce(false)
    .mockReturnValue(true)

  await cleanup(remove, rewrite)

  expect(dir.get()).toEqual({
    "app.js": "new content",
    "index.html": "modified content",
    "readme.md" : "new content"
  })
})
