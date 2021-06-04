import dir from '../../__mocks__/directory.js'
import { checkFiles } from '../../src/utils/checkFiles.js'

jest.mock('fs')
jest.mock('fs/promises')

const modifiedDir = {
  "index.html": "modified content",
  "readme.md": "content"
}

const files = {
  "index.html": { oldContent: "content", newContent: "new content" },
  "readme.md": { oldContent: "content", newContent: "new content" },
  "app.js": { oldContent: "content", newContent: "new content" }
}

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