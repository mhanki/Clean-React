"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileProcessor = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
class FileProcessor {
    constructor() {
        this.getFilePaths = (directory) => {
            let filePaths = [];
            _getPaths(directory);
            function _getPaths(dir) {
                const dirContent = fs_1.default.readdirSync(dir);
                for (const content of dirContent) {
                    const filePath = path_1.default.join(dir, content);
                    if (fs_1.default.statSync(filePath).isDirectory()) {
                        _getPaths(filePath);
                    }
                    else {
                        filePaths.push(filePath);
                    }
                }
            }
            return this.getRelativePath(filePaths, directory + '/');
        };
        this.readFiles = (files, dir) => {
            const fileInfos = files.map((file) => {
                const filePath = dir + '/' + file;
                return {
                    "path": filePath,
                    "relPath": file,
                    "content": fs_1.default.readFileSync(filePath).toString()
                };
            });
            return fileInfos;
        };
        this.rewriteOne = (file) => (0, promises_1.writeFile)(file.path, file.content);
        this.rewriteAll = (files) => files.map(file => (0, promises_1.writeFile)(file.path, file.content));
        this.writeAll = (files, dir) => files.map(file => {
            if (file.relPath.match(new RegExp(/^git\w*/))) {
                file.relPath = '.' + file.relPath;
            }
            return (0, promises_1.writeFile)(path_1.default.join(dir, file.relPath), file.content);
        });
        this.removeOne = (filePath) => (0, promises_1.unlink)(filePath);
        this.removeAll = (paths, dir) => paths.map(filePath => this.removeOne(path_1.default.join(dir, filePath)));
    }
    getRelativePath(paths, splitter) {
        return Array.isArray(paths)
            ? paths.map(filePath => filePath.split(splitter)[1])
            : paths.split(splitter)[1];
    }
}
exports.FileProcessor = FileProcessor;
