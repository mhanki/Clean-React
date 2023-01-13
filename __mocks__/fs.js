import dir from './directory.js';

const fs = jest.createMockFromModule('fs');

const existsSync = (path) => dir.getOne(path) !== undefined;

const readFileSync = (path) => dir.getOne(path);

fs.existsSync = existsSync;
fs.readFileSync = readFileSync;

export default fs;
