"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPty = void 0;
const node_pty_1 = require("node-pty");
const path_1 = __importDefault(require("path"));
const SHELL = "bash";
function createPty(roomId, onData) {
    try {
        let term = (0, node_pty_1.spawn)(SHELL, [], {
            cols: 35,
            rows: 22,
            name: 'xterm-color',
            cwd: path_1.default.join(__dirname, `../tmp/${roomId}`)
        });
        term.onData((data) => {
            return onData(data);
        });
        term.onExit(() => {
            term.kill();
            console.log("User exited terminal", roomId);
        });
        return term;
    }
    catch (error) {
        console.log(error);
    }
}
exports.createPty = createPty;
//# sourceMappingURL=pty.js.map