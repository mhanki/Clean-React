import { printMessage } from './utils/userPrompts.js'
import checkDirectory from './utils/checkDirectory.js'
import { filesToRemove, filesToRewrite } from './files.js'
import { cleanup } from './cleanup.js'

const cleanReactApp = async () => {
  printMessage(["Cleaning...  🧹💨"], "info")

  const start = await checkDirectory()

  if(start){
    await cleanup(filesToRemove, filesToRewrite)
    printMessage(["", "✨ All done! ✨", " Happy coding!"], "info")
  }
  
  process.exit()
}

export default cleanReactApp