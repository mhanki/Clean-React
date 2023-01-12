import dir from './directory.js';

const fs = jest.createMockFromModule('fs');

const unlink = (path) => dir.remove(path);

const existsSync = (path) => dir.get().hasOwnProperty(path);

const readFileSync = (path) => dir.getOne(path);

fs.unlink = unlink;
fs.existsSync = existsSync;
fs.readFileSync = readFileSync;

export default fs;
