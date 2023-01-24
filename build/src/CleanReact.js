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
const path_1 = __importDefault(require("path"));
const Prompt_1 = require("./Prompt");
const Validator_1 = require("./Validator");
const FileProcessor_1 = require("./FileProcessor");
const Symbol_1 = require("./Symbol");
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
            const craDirectories = ['src', 'public'].map(dir => path_1.default.join(this.targetDir, dir));
            const missingDirs = validator.findMissingDirs(craDirectories);
            if (missingDirs.length > 0) {
                const message = [
                    `${Symbol_1.Symbol.WARNING}\xa0\xa0\xa0It seems your project is missing the following Create React App sub-directories:`,
                    ...missingDirs.map(dir => "\xa0\xa0\xa0- " + dir)
                ];
                consolePrompt.message(message, "WARNING");
                yield consolePrompt.permission("Are you sure you want to proceed?", "WARNING")
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
                    "The following files already contain changes to the original CRA template:",
                    ...files.map(file => "\xa0\xa0- " + file)
                ];
                consolePrompt.message(message, "WARNING");
                const permission = yield consolePrompt.permission("Do you want to discard all previous changes?");
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
            const proceed = yield this.isDirCraProject();
            if (!proceed) {
                return;
            }
            const language = yield validator.determineLanguage(path_1.default.join(this.targetDir, 'src'));
            const templateType = 'default';
            // const templateType = process.argv[2] ? process.argv[2] : 'default';
            const templateFolder = path_1.default.join(this.TEMPLATES_DIR, templateType, language);
            /* if(!fs.existsSync(templateFolder)){
              return consolePrompt.message(["The template folder doesn't exist", templateFolder]);
            } */
            const craTemplates = this.getFiles(path_1.default.join(this.TEMPLATES_DIR, 'cra', language));
            const templates = this.getFiles(templateFolder);
            const targetPaths = fileProcessor.getFilePaths(this.targetDir);
            const modifiedFiles = yield validator.changedFiles(craTemplates, this.targetDir);
            const filesToKeep = yield this.getFilesToKeep(modifiedFiles);
            const filesToRemove = targetPaths
                .filter(targetPath => craTemplates.find(template => template.relPath === targetPath))
                .filter(targetPath => !templates.find(template => template.relPath === targetPath))
                .filter(targetPath => !filesToKeep.includes(targetPath));
            const filesToRewrite = templates.filter(template => !filesToKeep.includes(template.relPath));
            yield Promise.all(fileProcessor.writeAll(filesToRewrite, this.targetDir));
            yield Promise.all(fileProcessor.removeAll(filesToRemove, this.targetDir));
            const endMessage = [`${Symbol_1.Symbol.STARS} All done! ${Symbol_1.Symbol.STARS}`, " Happy coding!"];
            consolePrompt.message(endMessage);
        });
    }
}
exports.CleanReact = CleanReact;
