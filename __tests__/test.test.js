const { fs, vol } = require('memfs')
const directory = require('./directory.json')

beforeEach(() => {
  vol.reset()
  vol.fromJSON(directory)
})

describe('My Test Suite', () => {
  it('creates a mock directory', () => {
    expect(fs.readFileSync("./src/App.test.js", {encoding:'utf8', flag:'r'})).toEqual('App.test')
  })

  it('removes file successfully', () => {
    expect(fs.existsSync("./src/App.test.js")).toEqual(true)
    fs.unlinkSync("./src/App.test.js")
    expect(fs.existsSync("./src/App.test.js")).toEqual(false)
  })

  it('rewrites file successfully', () => {
    expect(fs.readFileSync("./src/setupTests.js", {encoding:'utf8', flag:'r'})).toEqual("setupTest")
    fs.writeFileSync("./src/setupTests.js", "")
    expect(fs.readFileSync("./src/setupTests.js", {encoding:'utf8', flag:'r'})).toEqual("")
  })
})

// uni test for utils
it('successfully removes existing file', () => {
  
})

it('does not remove non-existent file', () => {
  
})

it('rewrites the content of a file, given an existent file path', () => {

})

it('writes a new file with the appropriate content, given a non-existent file path', () => {

})

describe("clean-react-app", () => {
  /** delete files
   * unlinkSync(filepath, callback)
  */
  it("deletes all files successfully", () => {

  })

  /** create (rewrite) file with right content
   * writeFileSync(path, content, callback)
  */
 it("rewrites all files successfully", () => {

 })

  /** don't proceed when directories (src, public) are missing */
  it("gives a warning when directory structure doesn't match", () => {

  })

  it("stops porgram after warning", () => {

  })

  it("does not give a warning when directory structure matches", () => {

  })
  
  /** ask to proceed if file doesn't exist */
  it("asks for permission to proceed if file doesn't exist", () => {

  })

  it("does not ask for permission to proceed if file exists", () => {

  })

  it("creates file if permission is given", () => {

  })

  it("skips file if permission is denied", () => {

  })

  /** check if file contents have been rewritten and ask for permission/give warning */
})



