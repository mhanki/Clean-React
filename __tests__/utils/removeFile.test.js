import dir from '../../__mocks__/directory.js'
import fs from '../../__mocks__/fs.js'
import removeFile from '../../src/utils/removeFile.js'

jest.mock('fs')

dir.set({
  "/app.js": "app content",
  "/src/whatever": "content"
})

describe("removeFile", () => {
  it("succesfully removes existing file", () => {
    expect(fs.existsSync("/app.js")).toBe(true)
    removeFile("/app.js")
    expect(fs.existsSync("/app.js")).toBe(false)
  })
  
  it("doesn't remove anything if file doesn't exist", () => {
    expect(fs.existsSync('/wrongFilepath.js')).toBe(false)
    removeFile('/wrongFilepath.js')
    expect(dir.files).toEqual({ "/src/whatever": "content" })
  })
})
