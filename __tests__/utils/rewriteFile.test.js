import dir from '../../__mocks__/directory.js'
import fs from '../../__mocks__/fs.js'
import rewriteFile from '../../src/utils/rewriteFile.js'

jest.mock('fs')

describe("rewriteFile", () => {
  it("creates a new file if file doesn't exist", async () => {
    expect(fs.existsSync('whatever')).toBe(false)
    await rewriteFile('whatever', 'content')
    expect(dir.files).toEqual({ 'whatever': 'content' })
  })
  
  it("rewrites the content of a file if file exists", async () => {
    expect(fs.existsSync('whatever')).toBe(true)
    await rewriteFile('whatever', 'updated content')
    expect(dir.files).toEqual({ 'whatever': 'updated content' })
  })
})
