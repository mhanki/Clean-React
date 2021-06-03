import fs from 'fs'

const findMissingDirs = (dirs) => dirs.filter((dir) => !fs.existsSync(dir))

export { findMissingDirs }