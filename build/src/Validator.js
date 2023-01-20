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
exports.Validator = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("fs/promises");
class Validator {
    constructor() {
        this.findMissingDirs = (dirs) => dirs.filter((dir) => !fs_1.default.existsSync(dir));
        /**
         * @param targetDir Path to the directory that should be searched
         * @param files Array of relative filepaths to search for
         */
        this.removedFiles = (targetDir, files) => files.filter((file) => {
            const filePath = path_1.default.join(targetDir, file);
            return !fs_1.default.existsSync(filePath);
        });
        /**
         * Looks for files in target dir and compares their content to a template
         * @param templates
         * @param targetDir
         * @returns Array with the names of modified files
         */
        this.changedFiles = (templates, tagetDir) => { var _a, templates_1, templates_1_1; return __awaiter(this, void 0, void 0, function* () {
            var _b, e_1, _c, _d;
            let changedFiles = [];
            try {
                for (_a = true, templates_1 = __asyncValues(templates); templates_1_1 = yield templates_1.next(), _b = templates_1_1.done, !_b;) {
                    _d = templates_1_1.value;
                    _a = false;
                    try {
                        const file = _d;
                        const target = path_1.default.join(tagetDir, file.path.split(/\/[JT]S\//)[1]);
                        if (fs_1.default.existsSync(target)) {
                            yield (0, promises_1.readFile)(target)
                                .then((content) => {
                                if (content.toString() !== file.content) {
                                    changedFiles.push(target);
                                }
                            })
                                .catch(err => { console.log(err); });
                        }
                    }
                    finally {
                        _a = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = templates_1.return)) yield _c.call(templates_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return changedFiles;
        }); };
        this.determineLanguage = (directory) => __awaiter(this, void 0, void 0, function* () {
            const srcFiles = yield (0, promises_1.readdir)(directory);
            if (srcFiles.length === 0) {
                return "JS";
            }
            const filteredFiles = srcFiles.filter(file => path_1.default.extname(file).match(/\.[tj]sx?$/));
            const extension = path_1.default.extname(filteredFiles[0]);
            return extension === '.js'
                ? "JS"
                : "TS";
        });
    }
}
exports.Validator = Validator;
