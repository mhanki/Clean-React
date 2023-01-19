import dir from './directory.js';

const fs = jest.createMockFromModule('fs');

const existsSync = (path) => dir.getOne(path) !== undefined;

const readFileSync = (path) => dir.getOne(path);

const readdirSync = (path) => {
  return Object.keys(dir.getOne(path))
}; 

const statSync = (path) => ({
  isDirectory: () => typeof dir.getOne(path) !== 'string'
})

fs.existsSync = existsSync;
fs.readFileSync = readFileSync;
fs.statSync = statSync;
fs.readdirSync = readdirSync;

export default fs;
