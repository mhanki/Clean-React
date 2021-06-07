import { printMessage } from './utils/userPrompts.js'
import checkDirectory from './utils/checkDirectory.js'
import { filesToRemove, filesToRewrite, SYMBOLS } from './config.js'
import { cleanup } from './cleanup.js'

const { icon, CLEANING, STARS } = SYMBOLS

const cleanReact = async () => {
  printMessage([`Cleaning... ${icon(CLEANING)}`], "info")

  const start = await checkDirectory()

  if(start){
    await cleanup(filesToRemove, filesToRewrite)
    printMessage(["", `${icon(STARS)} All done! ${icon(STARS)}`, " Happy coding!"], "info")
  }
  
  process.exit()
}

export default cleanReact