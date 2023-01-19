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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prompt = void 0;
const chalk_1 = __importDefault(require("chalk"));
const readline_1 = __importDefault(require("readline"));
const b = chalk_1.default.bold;
var MessageType;
(function (MessageType) {
    MessageType["INFO"] = "green";
    MessageType["WARNING"] = "yellow";
})(MessageType || (MessageType = {}));
;
class Prompt {
    constructor() {
        this.message = (messages, type = 'INFO') => {
            const color = MessageType[type];
            messages.forEach(message => console.log(chalk_1.default[color](message)));
            console.log('');
        };
        this.permission = (message) => __awaiter(this, void 0, void 0, function* () {
            const rl = readline_1.default.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            function question(query) {
                return new Promise(resolve => {
                    rl.question(query, resolve);
                });
            }
            ;
            const answer = yield question(chalk_1.default.green(`${message} (y/n) `));
            const permission = answer.toLowerCase() == 'y';
            rl.close();
            console.log('');
            return permission;
        });
    }
}
exports.Prompt = Prompt;
