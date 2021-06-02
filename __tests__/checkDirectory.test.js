import dir from '../__mocks__/directory.js'
import * as prompts from '../src/utils/userPrompts'
import checkDirectory from '../src/checkDirectory.js'

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
const findMissingDirsSpy = jest.spyOn(prompts, 'findMissingDirs')

const _givePermission = (input) => permissionSpy.mockImplementationOnce(() => new Promise((resolve, reject) => resolve(input)))

afterEach(() => {
  dir.reset()
  jest.clearAllMocks()
})

it("checks the current directory for missing sub-directories", () => {
  dir.set(wrongDir)
  _givePermission(true)

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
  _givePermission(true)
  
  checkDirectory()
  
  expect(warnUserSpy).toBeCalledTimes(1)
})

it("proceeds if user gives permission", async () => {
  dir.set(wrongDir)
  _givePermission(true)
  
  expect(await checkDirectory()).toBe(true)
})

it("exits if user denies permission to proceed", async () => {
  dir.set(wrongDir)
  _givePermission(false)
  
  expect(await checkDirectory()).toBe(false)
})