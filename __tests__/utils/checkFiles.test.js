import dir from '../../__mocks__/directory.js'
import { checkFiles, checkFiletype } from '../../src/utils/checkFiles.js'

jest.mock('fs')
jest.mock('fs/promises')

const modifiedDir = {
  "index.html": "modified content",
  "readme.md": "content"
}

const jsDir = {
  "src/app.js": "",
  "readme.md": "",
  "src/index.js": "",
  "src/something.md": ""
}

const tsDir = {
  "src/app.tsx": "",
  "readme.md": "",
  "src/index.tsx": "",
  "src/something.md": ""
}

describe("checkFiletype", () => {
  const files = {
    "src/app.js": {},
    "readme.md": {},
    "src/index.js": {},
    "src/something.md": {}
  }

  it("checks if the project contains .js or .tsx files", async () => {
    dir.set(tsDir)

    let converted = await checkFiletype(files)
    expect(converted).toEqual({
      "src/app.tsx": {},
      "readme.md": {},
      "src/index.tsx": {},
      "src/something.md": {}
    })

    dir.set(jsDir)

    converted = await checkFiletype(files)
    expect(converted).toEqual({
      "src/app.js": {},
      "readme.md": {},
      "src/index.js": {},
      "src/something.md": {}
    })
  })
})

describe("checkFiles", () => {
  dir.set(modifiedDir)

  const files = {
    "index.html": { oldContent: "content", newContent: "new content" },
    "readme.md": { oldContent: "content", newContent: "new content" },
    "app.js": { oldContent: "content", newContent: "new content" }
  }
 
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