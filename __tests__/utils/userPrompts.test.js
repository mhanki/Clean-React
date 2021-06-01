import dir from '../../__mocks__/directory.js'
import { findMissingDirs, warnUser } from '../../src/utils/userPrompts'

jest.mock('fs')

afterEach(() => dir.reset())

describe("userPrompts", () => {
  it("return an array of missing sub-directories", () => {
    dir.set({
      "src": {},
      "index.js": "content"
    })
    expect(findMissingDirs()).toEqual(['public', 'node_modules'])
  })
  
  it("give a warning displaying all missing directories", () => {
    const consoleSpy = jest.spyOn(console, 'log')
    warnUser(['src', 'public'])
    expect(consoleSpy).toBeCalledTimes(3)
  })
})