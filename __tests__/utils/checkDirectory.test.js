import dir from '../../__mocks__/directory.js'
import * as prompts from '../../src/utils/userPrompts'
import * as checks from '../../src/utils/searchDirectory.js'
import checkDirectory from '../../src/utils/checkDirectory.js'

jest.mock('fs')

const wrongDir = {
  "src": {},
  "index.js": "content"
}

const correctDir = {
  "src": {},
  "node_modules": {},
  "public": {}
}

const permissionSpy = jest.spyOn(prompts, 'getPermission')
const warnUserSpy = jest.spyOn(prompts, 'warnUser')
const findMissingDirsSpy = jest.spyOn(checks, 'findMissingDirs')

afterEach(() => {
  dir.reset()
  jest.clearAllMocks()
})

it("checks the current directory for missing sub-directories", () => {
  dir.set(wrongDir)
  permissionSpy.mockReturnValueOnce(true)

  checkDirectory()

  expect(findMissingDirsSpy).toBeCalledTimes(1)
  expect(findMissingDirsSpy).toHaveReturnedWith(['public', 'node_modules'])
})

it("returns if directory structure is correct", () => {
  dir.set(correctDir)

  expect(warnUserSpy).toBeCalledTimes(0)
  expect(permissionSpy).toBeCalledTimes(0)
})

it("gives a warning when directory structure doesn't match", () => {
  dir.set(wrongDir)
  permissionSpy.mockReturnValueOnce(true)
  
  checkDirectory()
  
  expect(warnUserSpy).toBeCalledTimes(1)
})

it("proceeds if user gives permission", async () => {
  dir.set(wrongDir)
  permissionSpy.mockReturnValueOnce(true)
  
  expect(await checkDirectory()).toBe(true)
})

it("exits if user denies permission to proceed", async () => {
  dir.set(wrongDir)
  permissionSpy.mockReturnValueOnce(false)
  
  expect(await checkDirectory()).toBe(false)
})