"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanReact = void 0;
const Prompt_1 = require("./Prompt");
const Validator_1 = require("./Validator");
const FileProcessor_1 = require("./FileProcessor");
const Symbol_1 = require("./Symbol");
const path_1 = __importDefault(require("path"));
const consolePrompt = new Prompt_1.Prompt();
const validator = new Validator_1.Validator();
const fileProcessor = new FileProcessor_1.FileProcessor();
class CleanReact {
    constructor(dir) {
        this.TEMPLATES_DIR = path_1.default.join(__dirname, '..', '..', 'templates');
        this.targetDir = dir;
    }
    isDirCraProject() {
        return __awaiter(this, void 0, void 0, function* () {
            let result = true;
            // Find missing directories
            const craDirectories = ['src', 'public'].map(dir => path_1.default.join(this.targetDir, dir));
            const missingDirs = validator.findMissingDirs(craDirectories);
            // Print warning if dirs are missing
            if (missingDirs.length > 0) {
                const message = [
                    "It seems your project is missing the following sub-directories:",
                    ...missingDirs.map(dir => "- " + dir)
                ];
                consolePrompt.message(message, "WARNING");
                // Prompt for permission to proceed
                yield consolePrompt.permission("Are you sure you want to proceed?")
                    .then(val => result = val);
            }
            return result;
        });
    }
    getFiles(directory) {
        const paths = fileProcessor.getFilePaths(directory);
        return fileProcessor.readFiles(paths, directory);
    }
    getFilesToKeep(files) {
        var _a, files_1, files_1_1;
        var _b, e_1, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let keep = [];
            if (files.length > 0) {
                const message = [
                    "The following files have already been changed:",
                    ...files.map(file => "- " + file)
                ];
                consolePrompt.message(message, "WARNING");
                const permission = yield consolePrompt.permission("Do you want to discard all changes?");
                if (!permission) {
                    try {
                        for (_a = true, files_1 = __asyncValues(files); files_1_1 = yield files_1.next(), _b = files_1_1.done, !_b;) {
                            _d = files_1_1.value;
                            _a = false;
                            try {
                                const file = _d;
                                const filename = fileProcessor.getRelativePath([file], this.targetDir + '/')[0];
                                const message = "Do you want to keep the changs made to " + filename + "?";
                                yield consolePrompt.permission(message)
                                    .then(permission => {
                                    if (permission) {
                                        keep.push(filename);
                                    }
                                });
                            }
                            finally {
                                _a = true;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_a && !_b && (_c = files_1.return)) yield _c.call(files_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            return keep;
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const startMessage = [`Cleaning... ${Symbol_1.Symbol.CLEANING}`];
            consolePrompt.message(startMessage);
            if (!this.isDirCraProject()) {
                return;
            }
            const language = yield validator.determineLanguage(path_1.default.join(this.targetDir, 'src'));
            const templateType = 'default'; // Check config here
            const craTemplates = this.getFiles(path_1.default.join(this.TEMPLATES_DIR, 'cra', language));
            const templates = this.getFiles(path_1.default.join(this.TEMPLATES_DIR, templateType, language));
            const targetPaths = fileProcessor.getFilePaths(this.targetDir); //  + "/public"
            const modifiedFiles = yield validator.changedFiles(craTemplates, this.targetDir);
            const filesToKeep = yield this.getFilesToKeep(modifiedFiles);
            let removeFiles = targetPaths
                .filter(file => craTemplates.find(template => template.relPath === file))
                .filter(file => !templates.find(template => template.relPath === file));
            let write = templates.filter(template => !filesToKeep.includes(template.relPath));
            yield Promise.all(fileProcessor.writeAll(write, this.targetDir));
            removeFiles.filter(file => !filesToKeep.includes(file));
            yield Promise.all(fileProcessor.removeAll(removeFiles, this.targetDir));
            const endMessage = [`${Symbol_1.Symbol.STARS} All done! ${Symbol_1.Symbol.STARS}`, " Happy coding!"];
            consolePrompt.message(endMessage);
        });
    }
}
exports.CleanReact = CleanReact;
