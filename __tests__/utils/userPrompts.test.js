import dir from '../../__mocks__/directory.js'
import { warnUser, getPermission } from '../../src/utils/userPrompts.js'

jest.mock('fs')
jest.mock('readline')

afterEach(() => dir.reset())

describe("warnUser", () => {
  it("gives a warning displaying all missing directories", () => {
    const consoleSpy = jest.spyOn(console, 'log')
    warnUser(['src', 'public'])
    expect(consoleSpy).toBeCalledTimes(4)
  })
})

describe("getPermission", () => {  
  it("returns true if user answers 'y'", async () => {
    let permission = await getPermission('Permission granted?')

    expect(permission).toBe(true) // input 'y
  })

  it("returns false if user answers anything else", async () => {
    let permission = await getPermission('Permission granted?')
    expect(permission).toBe(false) // input 'n'

    permission = await getPermission('Permission granted?')
    expect(permission).toBe(false) // input 'gibberish'
  })
})