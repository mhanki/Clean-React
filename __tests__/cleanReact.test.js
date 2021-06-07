import dir from '../__mocks__/directory.js'
import cleanReact from '../src/cleanReact.js'
import * as checkDirectory from '../src/utils/checkDirectory.js'
import * as cleanup from '../src/cleanup.js'

jest.mock('fs')
jest.mock('fs/promises')

const checkDirectorySpy = jest.spyOn(checkDirectory, 'default')
const cleanupSpy = jest.spyOn(cleanup, 'cleanup')
const mockExit = jest.spyOn(process, 'exit')

cleanupSpy.mockImplementation(() => new Promise((resolve, reject) => setTimeout(() => resolve(), 300)))
mockExit.mockImplementation(() => {code: 1})

afterEach(() => {
  dir.reset()
  jest.clearAllMocks()
})

it("exits if directory check fails", async () => {
  checkDirectorySpy.mockImplementationOnce(() => false)

  await cleanReact()

  expect(cleanupSpy).toHaveBeenCalledTimes(0)
  expect(mockExit).toHaveBeenCalledTimes(1)
})

it("starts cleanup if directory check succeeds", async () => {
  checkDirectorySpy.mockImplementationOnce(() => true)

  await cleanReact()

  expect(checkDirectorySpy).toHaveBeenCalledTimes(1)
  expect(cleanupSpy).toHaveBeenCalledTimes(1)
  expect(mockExit).toHaveBeenCalledTimes(1)
})

it("prints start and exit messages", async () => {
  const consoleSpy = jest.spyOn(console, 'log')
  checkDirectorySpy.mockImplementationOnce(() => true)

  await cleanReact()

  expect(consoleSpy).toHaveBeenCalledTimes(4)
})